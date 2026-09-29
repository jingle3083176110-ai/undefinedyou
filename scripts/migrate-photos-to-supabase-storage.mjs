import { readFile } from "node:fs/promises";
import { extname, isAbsolute, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

import { galleryPhotos } from "../lib/photos.js";

const previewBucket = "photo-previews";
const originalsBucket = "photo-originals";
const publicPhotosRoot = resolve(process.cwd(), "public", "photos");

export const previewTransform = Object.freeze({ maxWidth: 2000, quality: 82, format: "webp" });

export function storagePathsFor(sourcePath) {
  if (!sourcePath.startsWith("/photos/")) {
    throw new Error(`Photo path must be inside the public photos directory: ${sourcePath}`);
  }

  const sourceFile = resolve(process.cwd(), "public", sourcePath.slice(1));
  const relativePath = relative(publicPhotosRoot, sourceFile);
  if (!relativePath || isAbsolute(relativePath) || relativePath === ".." || relativePath.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`)) {
    throw new Error(`Photo path must be inside the public photos directory: ${sourcePath}`);
  }

  const extension = extname(relativePath);
  if (!extension) {
    throw new Error(`Photo path must include a file extension: ${sourcePath}`);
  }

  return {
    previewPath: `${relativePath.slice(0, -extension.length)}.webp`,
    originalPath: relativePath,
  };
}

function settings() {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!baseUrl || !secretKey) {
    throw new Error("请先设置 NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SECRET_KEY，再运行照片迁移。");
  }

  return { baseUrl, secretKey };
}

function objectUrl(baseUrl, bucket, path) {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return `${baseUrl}/storage/v1/object/${bucket}/${encodedPath}`;
}

function contentTypeFor(path) {
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".webp")) return "image/webp";
  if (path.endsWith(".jpeg") || path.endsWith(".jpg")) return "image/jpeg";
  return "application/octet-stream";
}

async function upload({ baseUrl, secretKey }, bucket, path, contents) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(objectUrl(baseUrl, bucket, path), {
        method: "POST",
        headers: {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": contentTypeFor(path),
          "x-upsert": "true",
        },
        body: contents,
      });
      if (response.ok) return;
      lastError = new Error(`Failed to upload ${bucket}/${path}: ${response.status} ${await response.text()}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
  }
  throw new Error(`Failed to upload ${bucket}/${path}: ${lastError?.message || "unknown network error"}`);
}

async function updatePhoto({ baseUrl, secretKey }, photo, previewPath, originalPath) {
  const response = await fetch(`${baseUrl}/rest/v1/photos?id=eq.${encodeURIComponent(photo.id)}`, {
    method: "PATCH",
    headers: {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      storage_path: `${baseUrl}/storage/v1/object/public/${previewBucket}/${previewPath.split("/").map(encodeURIComponent).join("/")}`,
      original_path: originalPath,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update photo ${photo.id}: ${response.status} ${await response.text()}`);
  }
}

export async function createPreview(contents) {
  return sharp(contents)
    .rotate()
    .resize({ width: previewTransform.maxWidth, withoutEnlargement: true })
    .webp({ quality: previewTransform.quality })
    .toBuffer();
}

export async function migratePhotos() {
  const config = settings();
  let migrated = 0;

  for (const [index, photo] of galleryPhotos.entries()) {
    const { previewPath, originalPath } = storagePathsFor(photo.src);
    const localPath = resolve(process.cwd(), "public", photo.src.slice(1));
    const originalContents = await readFile(localPath);
    const preview = await createPreview(originalContents);

    await upload(config, previewBucket, previewPath, preview);
    await upload(config, originalsBucket, originalPath, originalContents);
    await updatePhoto(config, photo, previewPath, originalPath);
    migrated += 1;
    console.log(`migrated ${index + 1}/${galleryPhotos.length}: ${photo.id}`);
  }

  return { migrated, localFilesDeleted: 0 };
}

const invokedAsScript = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (invokedAsScript) {
  migratePhotos()
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
