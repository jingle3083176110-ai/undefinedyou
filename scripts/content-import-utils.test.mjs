import test from "node:test";
import assert from "node:assert/strict";
import { collectionPhotoRows } from "./content-import-utils.mjs";

test("collectionPhotoRows preserves collection image order and skips unknown collections", () => {
  const rows = collectionPhotoRows([
    { slug: "theme", imageIds: ["photo-2", "photo-1"] },
    { slug: "missing", imageIds: ["photo-3"] },
  ], new Map([["theme", "collection-uuid"]]));

  assert.deepEqual(rows, [
    { collection_id: "collection-uuid", photo_id: "photo-2", sort_order: 0 },
    { collection_id: "collection-uuid", photo_id: "photo-1", sort_order: 1 },
  ]);
});
