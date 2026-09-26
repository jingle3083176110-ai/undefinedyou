import test from "node:test";
import assert from "node:assert/strict";
import { galleryPhotos, photoThemes, photoWorkshops } from "./photos.js";

test("gallery is newest first and each photo belongs to a collection", () => {
  assert.deepEqual(galleryPhotos.map((photo) => photo.id), ["midautumn-fair", "river-bridge", "autumn-courtyard"]);
  assert.ok(galleryPhotos.every((photo) => photo.collectionType && photo.collectionSlug));
});

test("initial theme and workshop reference supplied photographs", () => {
  assert.deepEqual(photoThemes[0].imageIds, ["river-bridge", "autumn-courtyard"]);
  assert.deepEqual(photoWorkshops[0].imageIds, ["midautumn-fair"]);
});
