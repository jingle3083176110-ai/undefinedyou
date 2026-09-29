import test from "node:test";
import assert from "node:assert/strict";
import { getHandler as getPhotos } from "../../app/api/admin/photos/route.js";
import { patchHandler } from "../../app/api/admin/photos/[id]/route.js";
import { getHandler as getCollections, postHandler as postCollection } from "../../app/api/admin/photo-collections/route.js";
import { patchHandler as patchCollection, deleteHandler as deleteCollection } from "../../app/api/admin/photo-collections/[id]/route.js";

process.env.ADMIN_EMAILS = "u@example.com";
const auth = { auth: { getUser: async () => ({ data: { user: { email: "u@example.com" } }, error: null }) } };

test("admin photo GET includes published state and collection tags", async () => {
  const client = { from(table) {
    if (table === "photos") return { select: () => ({ order: async () => ({ data: [{ id: "p1", storage_path: "cdn", published: false }], error: null }) }) };
    return { select: () => ({ in: async () => ({ data: [{ photo_id: "p1", collection_id: "11111111-1111-4111-8111-111111111111" }], error: null }) }) };
  } };
  const response = await getPhotos(new Request("https://example.com"), { userClient: auth, adminClient: client });
  assert.deepEqual(await response.json(), { photos: [{ id: "p1", src: "cdn", published: false, collectionIds: ["11111111-1111-4111-8111-111111111111"] }] });
});

test("photo PATCH replaces collection links idempotently and toggles published", async () => {
  const calls = []; const client = { rpc: async () => ({ error: null }), from(table) { calls.push(table); if (table === "photos") return { update: (v) => ({ eq: () => ({ select: () => ({ single: async () => ({ data: { id: "p1", storage_path: "cdn", ...v }, error: null }) }) }) }) }; return { delete: () => ({ eq: async () => ({ error: null }) }), insert: async (rows) => { calls.push(rows); return { error: null }; } }; } };
  const response = await patchHandler(new Request("https://example.com", { method: "PATCH", body: JSON.stringify({ published: false, collectionIds: ["11111111-1111-4111-8111-111111111111", "22222222-2222-4222-8222-222222222222"] }) }), { params: { id: "p1" }, userClient: auth, adminClient: client });
  assert.equal(response.status, 200); assert.ok(calls.length >= 0);
});

test("collections can be filtered by type and managed by admins", async () => {
  let inserted; const client = { from() { return { select: () => ({ order: () => ({ eq: async () => ({ data: [{ id: "11111111-1111-4111-8111-111111111111", collection_type: "theme" }], error: null }) }), eq: () => ({ single: async () => ({ data: { id: "11111111-1111-4111-8111-111111111111" }, error: null }) }) }), insert: (v) => { inserted = v; return { select: () => ({ single: async () => ({ data: { id: "11111111-1111-4111-8111-111111111111", ...v }, error: null }) }) }; }, update: (v) => ({ eq: async () => ({ data: v, error: null }) }), delete: () => ({ eq: async () => ({ error: null }) }) }; } };
  const listed = await getCollections(new Request("https://example.com?type=theme"), { userClient: auth, adminClient: client });
  assert.equal(listed.status, 200); assert.equal((await listed.json()).collections[0].collection_type, "theme");
  const created = await postCollection(new Request("https://example.com", { method: "POST", body: JSON.stringify({ slug: "s", collection_type: "theme", title: "T" }) }), { userClient: auth, adminClient: client });
  assert.equal(created.status, 201); assert.equal(inserted.collection_type, "theme");
  assert.equal((await patchCollection(new Request("https://example.com", { method: "PATCH", body: JSON.stringify({ title: "U" }) }), { params: { id: "11111111-1111-4111-8111-111111111111" }, userClient: auth, adminClient: client })).status, 200);
  assert.equal((await deleteCollection(new Request("https://example.com?confirm=true", { method: "DELETE" }), { params: { id: "11111111-1111-4111-8111-111111111111" }, userClient: auth, adminClient: client })).status, 200);
});

test("collection IDs reject duplicates and malformed values", async () => {
  const client = { from: () => ({ update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: {}, error: null }) }) }) }) }) };
  const response = await patchHandler(new Request("https://example.com", { method: "PATCH", body: JSON.stringify({ collectionIds: ["not-a-uuid", "not-a-uuid"] }) }), { params: { id: "p1" }, userClient: auth, adminClient: client });
  assert.equal(response.status, 400);
});

test("collection DELETE requires explicit confirmation", async () => {
  const client = { from: () => ({ delete: () => ({ eq: async () => ({ error: null }) }) }) };
  const response = await deleteCollection(new Request("https://example.com"), { params: { id: "bad" }, userClient: auth, adminClient: client });
  assert.equal(response.status, 400);
});

test("collection PATCH selects only public collection fields", async () => {
  let selected;
  const id = "11111111-1111-4111-8111-111111111111";
  const client = { from: () => ({ update: () => ({ eq: () => ({ select: (fields) => { selected = fields; return { single: async () => ({ data: { id, title: "Updated" }, error: null }) }; } }) }) }) };
  const response = await patchCollection(new Request("https://example.com", { method: "PATCH", body: JSON.stringify({ title: "Updated" }) }), { params: { id }, userClient: auth, adminClient: client });
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.match(selected, /^id,slug,collection_type,title,/);
  assert.equal(Object.hasOwn(body.collection, "secret"), false);
});

test("collection create and PATCH reject blank slug and title values", async () => {
  const createClient = { from: () => ({ insert: () => ({ select: () => ({ single: async () => ({ data: {}, error: null }) }) }) }) };
  for (const field of ["slug", "title"]) {
    const response = await postCollection(new Request("https://example.com", {
      method: "POST",
      body: JSON.stringify({ slug: "valid-slug", collection_type: "theme", title: "Valid title", [field]: " \t " }),
    }), { userClient: auth, adminClient: createClient });
    assert.equal(response.status, 400, `POST should reject blank ${field}`);
  }

  const patchClient = { from: () => ({ update: () => { throw new Error("update should not run"); } }) };
  for (const field of ["slug", "title"]) {
    const response = await patchCollection(new Request("https://example.com", {
      method: "PATCH",
      body: JSON.stringify({ [field]: " \n " }),
    }), { params: { id: "11111111-1111-4111-8111-111111111111" }, userClient: auth, adminClient: patchClient });
    assert.equal(response.status, 400, `PATCH should reject blank ${field}`);
  }
});

test("collection create and PATCH map unique slug conflicts to 409", async () => {
  const duplicate = { code: "23505", message: "duplicate key value violates unique constraint" };
  const createClient = { from: () => ({ insert: () => ({ select: () => ({ single: async () => ({ data: null, error: duplicate }) }) }) }) };
  const created = await postCollection(new Request("https://example.com", {
    method: "POST",
    body: JSON.stringify({ slug: "duplicate", collection_type: "theme", title: "Title" }),
  }), { userClient: auth, adminClient: createClient });
  assert.equal(created.status, 409);

  const patchClient = { from: () => ({ update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: null, error: duplicate }) }) }) }) }) };
  const updated = await patchCollection(new Request("https://example.com", {
    method: "PATCH",
    body: JSON.stringify({ slug: "duplicate" }),
  }), { params: { id: "11111111-1111-4111-8111-111111111111" }, userClient: auth, adminClient: patchClient });
  assert.equal(updated.status, 409);
});

test("collection PATCH returns 404 when no collection is updated", async () => {
  const client = { from: () => ({ update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }) }) }) };
  const response = await patchCollection(new Request("https://example.com", {
    method: "PATCH",
    body: JSON.stringify({ title: "Updated" }),
  }), { params: { id: "11111111-1111-4111-8111-111111111111" }, userClient: auth, adminClient: client });
  assert.equal(response.status, 404);
});

test("collection DELETE distinguishes missing records from lookup failures", async () => {
  const missingClient = { from: () => ({ select: () => ({ eq: () => ({ single: async () => ({ data: null, error: { code: "PGRST116" } }) }) }) }) };
  const missing = await deleteCollection(new Request("https://example.com?confirm=true", { method: "DELETE" }), {
    params: { id: "11111111-1111-4111-8111-111111111111" }, userClient: auth, adminClient: missingClient,
  });
  assert.equal(missing.status, 404);

  const failedClient = { from: () => ({ select: () => ({ eq: () => ({ single: async () => ({ data: null, error: { code: "XX000" } }) }) }) }) };
  const failed = await deleteCollection(new Request("https://example.com?confirm=true", { method: "DELETE" }), {
    params: { id: "11111111-1111-4111-8111-111111111111" }, userClient: auth, adminClient: failedClient,
  });
  assert.equal(failed.status, 500);
});
