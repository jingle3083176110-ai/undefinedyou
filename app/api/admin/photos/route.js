import { NextResponse } from "next/server.js";
import { cookies } from "next/headers.js";
import { createServerSupabaseClient } from "../../../../lib/supabase/server.js";
import { createAdminSupabaseClient } from "../../../../lib/supabase/admin.js";
import { uploadPhoto, publicPhoto, sanitizePhotoId, IMAGE_TYPES, validateCollectionIds } from "../../../../lib/photos/admin-storage.js";
import { isAdminEmail } from "../../../../lib/supabase/admin-access.js";
import crypto from "node:crypto";

function errorResponse(message, status) { return NextResponse.json({ error: message }, { status }); }

function parseBoolean(value, fallback) {
  if (value === null || value === undefined || value === "") return fallback;
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  throw new Error("Invalid published");
}

function parseCollectionIds(value) {
  if (value === null || value === undefined || value === "") return undefined;
  let ids;
  try { ids = typeof value === "string" ? JSON.parse(value) : value; } catch { throw new Error("Invalid collectionIds"); }
  return validateCollectionIds(ids);
}

function metadataString(form, key, fallback = "") {
  const value = form.get(key);
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value !== "string" || value.length > 500) throw new Error(`Invalid ${key}`);
  return value;
}
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const ASPECTS = new Set(["landscape", "portrait", "square", "wide", "tall"]);

export async function createPostHandler(request, { userClient, adminClient } = {}) {
  try {
    userClient ||= createServerSupabaseClient(await cookies());
    const { data, error: authError } = await userClient.auth.getUser();
    if (authError || !data?.user) return errorResponse("Unauthorized", 401);
    if (!isAdminEmail(data.user.email)) return errorResponse("Admin access is not configured", 403);
    const form = await request.formData();
    const file = form.get("file") || form.get("files");
    const photoId = sanitizePhotoId(form.get("photoId"));
    if (!(file instanceof File)) return errorResponse("An image file is required", 400);
    if (!IMAGE_TYPES.has(file.type)) return errorResponse("Unsupported image type", 400);
    adminClient ||= createAdminSupabaseClient();
    let existingPhoto = null;
    try {
      const baseQuery = typeof adminClient.from === "function" ? adminClient.from("photos") : null;
      const query = baseQuery && typeof baseQuery.select === "function" ? baseQuery.select("*") : null;
      if (query?.eq) {
        const lookup = await query.eq("id", photoId).single();
        if (lookup?.error && lookup.error.code !== "PGRST116") return errorResponse("Failed to load existing photo", 503);
        existingPhoto = lookup?.data || null;
      }
    } catch { return errorResponse("Failed to load existing photo", 503); }
    const collectionIds = parseCollectionIds(form.get("collectionIds"));
    const title = metadataString(form, "title");
    const date = metadataString(form, "date");
    if (date && (!DATE.test(date) || (() => { const parsed = new Date(`${date}T00:00:00Z`); return Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date; })())) throw new Error("Invalid date");
    const aspect = metadataString(form, "aspectRatio", "landscape");
    if (!ASPECTS.has(aspect)) throw new Error("Invalid aspectRatio");
    const metadata = {
      title, alt: title, location: metadataString(form, "locationEn"), location_zh: metadataString(form, "locationZh"),
      photo_date: date || null, note: metadataString(form, "descriptionEn"), note_zh: metadataString(form, "descriptionZh"), aspect,
    };
    const published = parseBoolean(form.get("published"), true);
    const uploadToken = crypto.randomUUID();
    const { paths, publicUrl } = await uploadPhoto({ adminClient, photoId, file, uploadToken });
    const row = { id: photoId, storage_path: publicUrl, original_path: paths.original, ...metadata, published };
    let result;
    try {
      result = await adminClient.from("photos").upsert(row, { onConflict: "id" });
    } catch {
      result = { error: new Error("database failure") };
    }
    if (result.error) {
      await Promise.allSettled([adminClient.storage.from("photo-previews").remove([paths.preview]), adminClient.storage.from("photo-originals").remove([paths.original])]);
      return errorResponse("Failed to save photo", 500);
    }
    if (collectionIds !== undefined) {
      let relation;
      try { relation = await adminClient.rpc("replace_photo_collections", { p_photo_id: photoId, p_collection_ids: collectionIds }); } catch (error) { relation = { error }; }
      if (relation?.error) {
        if (existingPhoto) {
          let restored;
          try { restored = await adminClient.from("photos").upsert(existingPhoto, { onConflict: "id" }); } catch (error) { restored = { error }; }
          const cleanup = await Promise.allSettled([adminClient.storage.from("photo-previews").remove([paths.preview]), adminClient.storage.from("photo-originals").remove([paths.original])]);
          if (restored?.error || cleanup.some((result) => result.status === "rejected" || result.value?.error)) return errorResponse("Failed to restore photo after collection failure; please retry", 503);
          return errorResponse("Failed to save photo collections; please retry", 503);
        }
        try {
          const deleted = await adminClient.from("photos").delete().eq("id", photoId);
          if (deleted?.error) return errorResponse("Failed to clean up photo after collection failure; please retry", 503);
        } catch { return errorResponse("Failed to clean up photo after collection failure; please retry", 503); }
        const cleanup = [adminClient.storage.from("photo-previews").remove([paths.preview]), adminClient.storage.from("photo-originals").remove([paths.original])];
        const cleanupResults = await Promise.allSettled(cleanup);
        if (cleanupResults.some((result) => result.status === "rejected" || result.value?.error)) return errorResponse("Upload cleanup failed; please retry", 503);
        return errorResponse("Failed to save photo collections; please retry", 500);
      }
    }
    if (existingPhoto) {
      let oldPreviewPath = existingPhoto.storage_path;
      try { oldPreviewPath = new URL(oldPreviewPath).pathname.split("/").pop(); } catch {}
      const cleanup = await Promise.allSettled([
        oldPreviewPath && oldPreviewPath !== paths.preview ? adminClient.storage.from("photo-previews").remove([oldPreviewPath]) : Promise.resolve({}),
        existingPhoto.original_path && existingPhoto.original_path !== paths.original ? adminClient.storage.from("photo-originals").remove([existingPhoto.original_path]) : Promise.resolve({}),
      ]);
      if (cleanup.some((result) => result.status === "rejected" || result.value?.error)) return errorResponse("Photo saved but old upload cleanup failed; please retry", 503);
    }
    return NextResponse.json({ photo: publicPhoto(row) }, { status: 201 });
  } catch (error) {
    const validation = /Unsupported image|too large|Invalid photo|image file|Invalid (published|collectionIds|date|aspectRatio|title|location|description)/i.test(error.message);
    return errorResponse(validation ? error.message : "Invalid upload", validation ? 400 : 500);
  }
}

export async function POST(request) { return createPostHandler(request); }

export async function getHandler(_request, { userClient, adminClient } = {}) {
  try {
    userClient ||= createServerSupabaseClient(await cookies());
    const { data, error } = await userClient.auth.getUser();
    if (error || !data?.user) return errorResponse("Unauthorized", 401);
    if (!isAdminEmail(data.user.email)) return errorResponse("Admin access is not configured", 403);
    adminClient ||= createAdminSupabaseClient();
    const result = await adminClient.from("photos").select("*").order("photo_date", { ascending: false });
    if (result.error) {
      console.error("Admin photo query failed", { code: result.error.code, message: result.error.message });
      return errorResponse("Failed to load photos", 500);
    }
    const rows = result.data || [];
    const ids = rows.map((row) => row.id);
    let links = [];
    if (ids.length) {
      try {
        const linked = await adminClient.from("collection_photos").select("collection_id,photo_id").in("photo_id", ids);
        // The photo list remains usable if the optional collection relation is unavailable.
        links = linked.error ? [] : (linked.data || []);
      } catch {
        links = [];
      }
    }
    return NextResponse.json({ photos: rows.map((row) => ({ ...publicPhoto(row), published: row.published, collectionIds: links.filter((link) => link.photo_id === row.id).map((link) => link.collection_id) })) });
  } catch (error) {
    console.error("Admin photo request failed", error);
    return errorResponse("Failed to load photos", 500);
  }
}
export async function GET(request, context) { return getHandler(request, context); }
