import assert from "node:assert/strict";
import test from "node:test";
import sharp from "sharp";

import { createPreview, previewTransform, storagePathsFor } from "./migrate-photos-to-supabase-storage.mjs";

test("storagePathsFor removes the public photos prefix", () => {
  assert.deepEqual(storagePathsFor("/photos/themes/landscape/a.webp"), {
    previewPath: "themes/landscape/a.webp",
    originalPath: "themes/landscape/a.webp",
  });
});

test("storagePathsFor rejects paths outside the public photos directory", () => {
  assert.throws(() => storagePathsFor("/images/a.webp"), /public photos directory/);
});

test("storagePathsFor rejects traversal outside the public photos directory", () => {
  assert.throws(() => storagePathsFor("/photos/../secret.jpg"), /public photos directory/);
});

test("storagePathsFor gives previews a webp path while preserving the original path", () => {
  assert.deepEqual(storagePathsFor("/photos/themes/landscape/a.jpg"), {
    previewPath: "themes/landscape/a.webp",
    originalPath: "themes/landscape/a.jpg",
  });
});

test("preview transform limits size and uses compressed webp", () => {
  assert.deepEqual(previewTransform, { maxWidth: 2000, quality: 82, format: "webp" });
});

test("createPreview makes a max-2000px webp preview", async () => {
  const source = Buffer.from('<svg width="3000" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="red"/></svg>');
  const preview = await createPreview(source);
  const metadata = await sharp(preview).metadata();

  assert.equal(metadata.format, "webp");
  assert.equal(metadata.width, 2000);
  assert.equal(metadata.height, 67);
});
