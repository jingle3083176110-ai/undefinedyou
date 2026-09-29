import test from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { createPostHandler } from "./route.js";
process.env.ADMIN_EMAILS = "u@example.com";

function request(fields) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.append(key, value);
  return new Request("https://example.com/api/admin/photos", { method: "POST", body: form });
}

function auth() {
  return { auth: { getUser: async () => ({ data: { user: { id: "u", email: "u@example.com" } }, error: null }) } };
}

async function jpeg() {
  return sharp({ create: { width: 2, height: 2, channels: 3, background: "red" } }).jpeg().toBuffer();
}

test("rejects unauthenticated upload", async () => {
  const response = await createPostHandler(request({ photoId: "one", file: new File(["x"], "x.jpg", { type: "image/jpeg" }) }), {
    userClient: { auth: { getUser: async () => ({ data: { user: null }, error: null }) } },
  });
  assert.equal(response.status, 401);
});

test("rejects missing or non-image files", async () => {
  const options = { userClient: { auth: { getUser: async () => ({ data: { user: { id: "u", email: "u@example.com" } }, error: null }) } } };
  const response = await createPostHandler(request({ photoId: "one", file: new File(["x"], "x.txt", { type: "text/plain" }) }), options);
  assert.equal(response.status, 400);
});

test("uploads preview and original then returns public metadata", async () => {
  const image = await sharp({ create: { width: 2, height: 2, channels: 3, background: "red" } }).jpeg().toBuffer();
  const calls = [];
  const storage = { from: (bucket) => ({ upload: async (path, body, options) => { calls.push(["upload", bucket, path, options]); return { data: { path }, error: null }; }, getPublicUrl: (path) => ({ data: { publicUrl: `https://cdn/${bucket}/${path}` } }), remove: async () => ({ error: null }) }) };
  const db = { from: () => ({ upsert: async (row, options) => { calls.push(["upsert", row, options]); return { data: [row], error: null }; }, select: function () { return this; }, single: async () => ({ data: null, error: null }) }) };
  const response = await createPostHandler(request({ photoId: "coast-001", title: "Coast", file: new File([image], "x.jpg", { type: "image/jpeg" }) }), { userClient: { auth: { getUser: async () => ({ data: { user: { id: "u", email: "u@example.com" } }, error: null }) } }, adminClient: { storage, from: db.from } });
  assert.equal(response.status, 201);
  const body = await response.json();
  assert.equal(body.photo.id, "coast-001");
  assert.match(body.photo.src, /^https:\/\/cdn\/photo-previews\/coast-001\.[a-f0-9-]+\.webp$/);
  assert.equal(Object.hasOwn(body.photo, "original_path"), false);
  assert.equal(calls.filter((x) => x[0] === "upload").length, 2);
  assert.equal(calls.find((x) => x[1] === "photo-previews")[3].contentType, "image/webp");
  assert.equal(calls.find((x) => x[1] === "photo-originals")[3].contentType, "image/jpeg");
  assert.deepEqual(calls.find((x) => x[0] === "upsert")[2], { onConflict: "id" });
});

test("rejects oversized files before storage", async () => {
  const response = await createPostHandler(request({ photoId: "large", file: new File([new Uint8Array(10 * 1024 * 1024 + 1)], "x.jpg", { type: "image/jpeg" }) }), { userClient: { auth: { getUser: async () => ({ data: { user: { id: "u", email: "u@example.com" } }, error: null }) } }, adminClient: {} });
  assert.equal(response.status, 400);
});

test("cleans preview when original upload fails", async () => {
  const removed = [];
  const storage = { from: (bucket) => ({ upload: async (path) => bucket === "photo-originals" ? { error: new Error("fail") } : { data: { path }, error: null }, remove: async (paths) => { removed.push([bucket, paths]); return { error: null }; }, getPublicUrl: () => ({ data: { publicUrl: "https://cdn/preview" } }) }) };
  const image = await sharp({ create: { width: 2, height: 2, channels: 3, background: "red" } }).jpeg().toBuffer();
  const response = await createPostHandler(request({ photoId: "fail", file: new File([image], "x.jpg", { type: "image/jpeg" }) }), { userClient: { auth: { getUser: async () => ({ data: { user: { id: "u", email: "u@example.com" } }, error: null }) } }, adminClient: { storage, from: () => ({}) } });
  assert.equal(response.status, 500);
  assert.equal(removed.length, 1); assert.match(removed[0][1][0], /^fail\.[a-f0-9-]+\.webp$/);
});

test("cleans both objects when database upsert fails", async () => {
  const removed = [];
  const storage = { from: (bucket) => ({ upload: async (path) => ({ data: { path }, error: null }), remove: async (paths) => { removed.push([bucket, paths]); return { error: null }; }, getPublicUrl: (path) => ({ data: { publicUrl: `https://cdn/${bucket}/${path}` } }) }) };
  const image = await sharp({ create: { width: 2, height: 2, channels: 3, background: "red" } }).jpeg().toBuffer();
  const adminClient = { storage, from: () => ({ upsert: async () => ({ error: new Error("database failure") }) }) };
  const response = await createPostHandler(request({ photoId: "db-fail", file: new File([image], "x.jpg", { type: "image/jpeg" }) }), { userClient: { auth: { getUser: async () => ({ data: { user: { id: "u", email: "u@example.com" } }, error: null }) } }, adminClient });
  assert.equal(response.status, 500);
  assert.equal(removed.length, 2); assert.ok(removed.every(([bucket, paths]) => paths[0].startsWith("db-fail.") && (bucket === "photo-originals" || bucket === "photo-previews")));
});

test("stores upload metadata, published state, and collection links", async () => {
  const image = await jpeg();
  const calls = [];
  const storage = { from: (bucket) => ({ upload: async (path) => ({ data: { path }, error: null }), getPublicUrl: (path) => ({ data: { publicUrl: `https://cdn/${bucket}/${path}` } }), remove: async () => ({ error: null }) }) };
  const adminClient = {
    storage,
    from: (table) => ({ upsert: async (row, options) => { calls.push([table, row, options]); return { data: [row], error: null }; } }),
    rpc: async (name, args) => { calls.push([name, args]); return { data: null, error: null }; },
  };
  const response = await createPostHandler(request({ photoId: "meta-001", title: "Title", locationEn: "Paris", locationZh: "巴黎", date: "2026-09-29", descriptionEn: "Desc", descriptionZh: "说明", aspectRatio: "portrait", published: "false", collectionIds: JSON.stringify(["11111111-1111-4111-8111-111111111111"]), file: new File([image], "x.jpg", { type: "image/jpeg" }) }), { userClient: auth(), adminClient });
  assert.equal(response.status, 201);
  const photo = calls.find(([table]) => table === "photos")[1];
  assert.equal(photo.title, "Title");
  assert.equal(photo.published, false);
  assert.equal(calls.find(([name]) => name === "replace_photo_collections")[1].p_collection_ids.length, 1);
});

test("rolls back photo row and storage when collection association fails", async () => {
  const image = await jpeg();
  const removed = [];
  const deleted = [];
  const storage = { from: (bucket) => ({ upload: async (path) => ({ data: { path }, error: null }), getPublicUrl: (path) => ({ data: { publicUrl: `https://cdn/${bucket}/${path}` } }), remove: async (paths) => { removed.push([bucket, paths]); return { error: null }; } }) };
  const adminClient = {
    storage,
    from: (table) => ({ upsert: async () => ({ data: [], error: null }), delete: () => ({ eq: async (...args) => { deleted.push([table, ...args]); return { error: null }; } }) }),
    rpc: async () => ({ error: new Error("relation failure") }),
  };
  const response = await createPostHandler(request({ photoId: "rollback-001", collectionIds: JSON.stringify(["11111111-1111-4111-8111-111111111111"]), file: new File([image], "x.jpg", { type: "image/jpeg" }) }), { userClient: auth(), adminClient });
  assert.equal(response.status, 500);
  assert.equal(removed.length, 2); assert.ok(removed.every(([bucket, paths]) => paths[0].startsWith("rollback-001.") && (bucket === "photo-originals" || bucket === "photo-previews")));
  assert.deepEqual(deleted, [["photos", "id", "rollback-001"]]);
});

test("rejects upload when existing photo lookup fails", async () => {
  const image = await jpeg();
  let uploads = 0;
  const adminClient = {
    storage: { from: () => ({ upload: async () => { uploads++; return { error: null }; }, getPublicUrl: () => ({ data: { publicUrl: "https://cdn/x" } }), remove: async () => ({ error: null }) }) },
    from: () => ({ select: () => ({ eq: () => ({ single: async () => ({ data: null, error: new Error("query failure") }) }) }) }),
  };
  const response = await createPostHandler(request({ photoId: "lookup-fail", file: new File([image], "x.jpg", { type: "image/jpeg" }) }), { userClient: auth(), adminClient });
  assert.equal(response.status, 503);
  assert.equal(uploads, 0);
});

test("preserves an existing photo and only removes versioned objects when collection RPC fails", async () => {
  const image = await jpeg();
  const oldRow = { id: "duplicate-001", storage_path: "https://cdn/photo-previews/duplicate-001.old.webp", original_path: "duplicate-001.old.original", title: "Old", published: true };
  const removed = [];
  const upserts = [];
  const storage = { from: (bucket) => ({ upload: async () => ({ data: {}, error: null }), getPublicUrl: (path) => ({ data: { publicUrl: `https://cdn/${bucket}/${path}` } }), remove: async (paths) => { removed.push([bucket, paths]); return { error: null }; } }) };
  const adminClient = {
    storage,
    from: (table) => table === "photos" ? {
      select: () => ({ eq: () => ({ single: async () => ({ data: oldRow, error: null }) }) }),
      upsert: async (row) => { upserts.push(row); return { data: [row], error: null }; },
    } : {},
    rpc: async () => ({ error: new Error("rpc failure") }),
  };
  const response = await createPostHandler(request({ photoId: "duplicate-001", title: "New", collectionIds: JSON.stringify(["11111111-1111-4111-8111-111111111111"]), file: new File([image], "x.jpg", { type: "image/jpeg" }) }), { userClient: auth(), adminClient });
  assert.equal(response.status, 503);
  assert.deepEqual(upserts.at(-1), oldRow);
  assert.equal(removed.some(([bucket, paths]) => paths[0] === "duplicate-001.old.webp" || paths[0] === "duplicate-001.old.original"), false);
  assert.equal(removed.length, 2);
  assert.ok(removed.every(([, paths]) => paths[0].startsWith("duplicate-001.") && !paths[0].includes(".old.")));
});

test("returns 503 when existing photo restoration fails after collection RPC failure", async () => {
  const image = await jpeg();
  const adminClient = {
    storage: { from: () => ({ upload: async () => ({ data: {}, error: null }), getPublicUrl: () => ({ data: { publicUrl: "https://cdn/new.webp" } }), remove: async () => ({ error: null }) }) },
    from: () => ({ select: () => ({ eq: () => ({ single: async () => ({ data: { id: "restore-fail", storage_path: "https://cdn/old.webp", original_path: "restore-fail.old.original" }, error: null }) }) }), upsert: (() => { let count = 0; return async () => (++count === 1 ? { data: [], error: null } : { error: new Error("restore failure") }); })() }),
    rpc: async () => ({ error: new Error("rpc failure") }),
  };
  const response = await createPostHandler(request({ photoId: "restore-fail", collectionIds: JSON.stringify([]), file: new File([image], "x.jpg", { type: "image/jpeg" }) }), { userClient: auth(), adminClient });
  assert.equal(response.status, 503);
});
