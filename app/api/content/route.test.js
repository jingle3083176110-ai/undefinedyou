import test from "node:test";
import assert from "node:assert/strict";
import { createContentResponse } from "./route.js";

test("content API JSON strips private original photo paths", async () => {
  const response = await createContentResponse(async () => ({
    projects: [],
    courses: [],
    journalEntries: [],
    photoThemes: [],
    photoWorkshops: [],
    photos: [{
      id: "photo-1",
      src: "https://example.supabase.co/storage/v1/object/public/photo-previews/one.webp",
      original_path: "private/originals/one.tiff",
      originalPath: "private/originals/one.tiff",
      alt: "Preview",
    }],
  }));

  const body = await response.json();
  const [photo] = body.photos;

  assert.equal(response.status, 200);
  assert.equal(photo.src, "https://example.supabase.co/storage/v1/object/public/photo-previews/one.webp");
  assert.equal(Object.hasOwn(photo, "original_path"), false);
  assert.equal(Object.hasOwn(photo, "originalPath"), false);
});
