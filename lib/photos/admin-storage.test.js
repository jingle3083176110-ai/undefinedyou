import test from "node:test";
import assert from "node:assert/strict";
import { sanitizePhotoId, storagePathsFor, publicPhoto } from "./admin-storage.js";

test("sanitizes photo ids and rejects traversal", () => {
  assert.equal(sanitizePhotoId(" coast_001 "), "coast_001");
  assert.throws(() => sanitizePhotoId("../secret"), /invalid|path/i);
  assert.throws(() => storagePathsFor("a/b"), /invalid|path/i);
});

test("public photo projection never includes original path", () => {
  const photo = publicPhoto({ id: "p1", storage_path: "p1.webp", original_path: "private/p1.jpg", alt: "A" });
  assert.deepEqual(photo, { id: "p1", src: "p1.webp", alt: "A" });
  assert.equal(Object.hasOwn(photo, "original_path"), false);
});
