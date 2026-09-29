import test from "node:test";
import assert from "node:assert/strict";
import { getHandler } from "../../app/api/admin/photos/[id]/route.js";
import { patchHandler, deleteHandler } from "../../app/api/admin/photos/[id]/route.js";
process.env.ADMIN_EMAILS = "u@example.com";
const auth = { auth: { getUser: async () => ({ data: { user: { id: "u", email: "u@example.com" } }, error: null }) } };
const photoId = "11111111-1111-4111-8111-111111111111";
test("single photo GET uses params and returns public fields", async () => {
  const response = await getHandler(new Request("https://example.com/api/admin/photos/one"), { params: { id: photoId }, userClient: auth, adminClient: { from: (table) => table === "collection_photos" ? { select: () => ({ in: async () => ({ data: [], error: null }) }) } : { select: () => ({ eq: () => ({ single: async () => ({ data: { id: photoId, storage_path: "cdn", original_path: "secret", published: true }, error: null }) }) }) } } });
  const body = await response.json(); assert.equal(response.status, 200); assert.deepEqual(body.photo, { id: photoId, src: "cdn", published: true, collectionIds: [] });
});
test("admin access rejects missing or non-matching allowlist", async () => {
  const original = process.env.ADMIN_EMAILS;
  process.env.ADMIN_EMAILS = "";
  const missing = await getHandler(new Request("https://example.com"), { params: { id: "one" }, userClient: auth, adminClient: {} });
  process.env.ADMIN_EMAILS = "other@example.com";
  const denied = await getHandler(new Request("https://example.com"), { params: { id: "one" }, userClient: auth, adminClient: {} });
  process.env.ADMIN_EMAILS = original;
  assert.equal(missing.status, 403); assert.equal(denied.status, 403);
});
test("PATCH updates only metadata and rejects invalid values", async () => {
  let update;
  const adminClient = { from: (table) => table === "collection_photos" ? { select: () => ({ eq: async () => ({ data: [], error: null }) }) } : { update: (value) => ({ eq: () => ({ select: () => ({ single: async () => { update = value; return { data: { id: photoId, ...value }, error: null }; } }) }) }), select: () => ({ eq: () => ({ single: async () => ({ data: { id: photoId }, error: null }) }) }) } };
  const response = await patchHandler(new Request("https://example.com", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ title: "T", location: "L", photo_date: "2024-01-02", aspect: "wide", storage_path: "bad", original_path: "bad" }) }), { params: { id: photoId }, userClient: auth, adminClient });
  assert.equal(response.status, 200); assert.deepEqual(update, { title: "T", location: "L", photo_date: "2024-01-02", aspect: "wide" });
  const invalid = await patchHandler(new Request("https://example.com", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ aspect: "bad" }) }), { params: { id: photoId }, userClient: auth, adminClient });
  assert.equal(invalid.status, 400);
});
test("PATCH converts an empty browser date into null", async () => {
  let update;
  const adminClient = { from: (table) => table === "collection_photos" ? { select: () => ({ eq: async () => ({ data: [], error: null }) }) } : { update: (value) => ({ eq: () => ({ select: () => ({ single: async () => { update = value; return { data: { id: photoId, ...value }, error: null }; } }) }) }), select: () => ({ eq: () => ({ single: async () => ({ data: { id: photoId }, error: null }) }) }) } };
  const response = await patchHandler(new Request("https://example.com", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ title: "T", photo_date: "" }) }), { params: { id: photoId }, userClient: auth, adminClient });
  assert.equal(response.status, 200); assert.equal(update.photo_date, null);
});
test("DELETE requires confirmation and removes database record and storage", async () => {
  const removed = []; let deleted = false;
  const adminClient = { from: () => ({ select: () => ({ eq: () => ({ single: async () => ({ data: { id: photoId }, error: null }) }) }), delete: () => ({ eq: async () => { deleted = true; return { error: null }; } }) }), storage: { from: (bucket) => ({ remove: async (paths) => { removed.push([bucket, paths]); return { error: null }; } }) } };
  const refused = await deleteHandler(new Request("https://example.com", { method: "DELETE" }), { params: { id: photoId }, userClient: auth, adminClient }); assert.equal(refused.status, 400);
  const response = await deleteHandler(new Request("https://example.com?confirm=true", { method: "DELETE" }), { params: { id: photoId }, userClient: auth, adminClient }); assert.equal(response.status, 200); assert.equal(deleted, true); assert.equal(removed.length, 2);
});
