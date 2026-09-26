import test from "node:test";
import assert from "node:assert/strict";
import { galleryPhotos, photoThemes, photoWorkshops } from "./photos.js";

test("gallery is newest first and each photo belongs to a collection", () => {
  const dated = galleryPhotos.filter((photo) => photo.date);
  assert.ok(dated.every((photo, index) => index === 0 || dated[index - 1].date >= photo.date));
  assert.ok(galleryPhotos.some((photo) => photo.id === "midautumn-fair"));
  assert.ok(galleryPhotos.every((photo) => photo.collectionType && photo.collectionSlug));
});

test("initial theme and workshop reference supplied photographs", () => {
  assert.deepEqual(photoThemes[0].imageIds.slice(0, 2), ["river-bridge", "autumn-courtyard"]);
  assert.deepEqual(photoWorkshops[0].imageIds, ["midautumn-fair"]);
});
