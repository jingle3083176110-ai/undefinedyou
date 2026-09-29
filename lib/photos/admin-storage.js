import sharp from "sharp";

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function validateCollectionIds(value) {
  if (!Array.isArray(value) || value.length > 50 || new Set(value).size !== value.length || value.some((id) => typeof id !== "string" || !UUID.test(id))) {
    throw new Error("Invalid collectionIds");
  }
  return value;
}

export function sanitizePhotoId(value) {
  const id = String(value || "").trim();
  if (!id || id.length > 120 || id === "." || id === ".." || !/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(id)) {
    throw new Error("Invalid photo id or path");
  }
  return id;
}

export function storagePathsFor(photoId, token = "") {
  const id = sanitizePhotoId(photoId);
  const suffix = token ? `.${String(token).replace(/[^a-zA-Z0-9_-]/g, "")}` : "";
  return { preview: `${id}${suffix}.webp`, original: `${id}${suffix}.original` };
}

export function publicPhoto(row) {
  const source = row || {};
  const allowed = ["id", "alt", "photo_date", "location", "location_zh", "note", "note_zh", "aspect", "title"];
  return Object.fromEntries([...allowed.map((key) => [key, source[key]]), ["src", source.storage_path || source.src]].filter(([, value]) => value !== undefined));
}


export async function transformImage(file) {
  if (!file || !IMAGE_TYPES.has(file.type)) throw new Error("Unsupported image type");
  if (file.size > MAX_IMAGE_BYTES) throw new Error("Image is too large");
  const input = Buffer.from(await file.arrayBuffer());
  const preview = await sharp(input).rotate().resize({ width: 2000, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
  return { input, preview };
}

export async function uploadPhoto({ adminClient, photoId, file, metadata = {}, uploadToken = "" }) {
  const paths = storagePathsFor(photoId, uploadToken);
  const { input, preview } = await transformImage(file);
  const uploaded = [];
  const upload = async (bucket, path, body, options) => {
    const result = await adminClient.storage.from(bucket).upload(path, body, { ...options, upsert: true });
    if (result.error) throw result.error;
    uploaded.push({ bucket, path });
  };
  try {
    await upload("photo-previews", paths.preview, preview, { contentType: "image/webp", cacheControl: "31536000" });
    await upload("photo-originals", paths.original, input, { contentType: file.type, cacheControl: "31536000" });
    const { data: publicData } = adminClient.storage.from("photo-previews").getPublicUrl(paths.preview);
    return { paths, uploaded, publicUrl: publicData?.publicUrl || paths.preview };
  } catch (error) {
    await Promise.allSettled(uploaded.map(({ bucket, path }) => adminClient.storage.from(bucket).remove([path])));
    throw error;
  }
}
