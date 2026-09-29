import { NextResponse } from "next/server.js";
import { cookies } from "next/headers.js";
import { createServerSupabaseClient } from "../../../../../lib/supabase/server.js";
import { createAdminSupabaseClient } from "../../../../../lib/supabase/admin.js";
import { publicPhoto, sanitizePhotoId, storagePathsFor } from "../../../../../lib/photos/admin-storage.js";
import { isAdminEmail } from "../../../../../lib/supabase/admin-access.js";

const fields = ["alt", "photo_date", "location", "location_zh", "note", "note_zh", "aspect", "title", "published"];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const errorResponse = (error, status) => NextResponse.json({ error }, { status });

async function clients(options = {}) {
  const userClient = options.userClient || createServerSupabaseClient(await cookies());
  const { data, error } = await userClient.auth.getUser();
  if (error || !data?.user) return { response: errorResponse("Unauthorized", 401) };
  if (!isAdminEmail(data.user.email)) return { response: errorResponse("Admin access is not configured", 403) };
  return { userClient, adminClient: options.adminClient || createAdminSupabaseClient() };
}

export async function getHandler(_request, { params, ...options } = {}) {
  try {
    const ready = await clients(options); if (ready.response) return ready.response;
    const id = (await params)?.id;
    const query = ready.adminClient.from("photos").select("*");
    const result = id ? await query.eq("id", sanitizePhotoId(id)).single() : await query.order("photo_date", { ascending: false });
    const { data, error } = result;
    if (error) return errorResponse("Failed to load photos", 500);
    const rows = id ? [data] : (data || []); const ids = rows.map((row) => row.id);
    let links = [];
    let enriched = false;
    if (ids.length) { const relation = ready.adminClient.from("collection_photos").select("collection_id,photo_id"); enriched = typeof relation.in === "function"; const linked = enriched ? await relation.in("photo_id", ids) : { data: [], error: new Error("Collection relation query unavailable") }; if (linked.error) return errorResponse("Failed to load photo collections", 500); links = linked.data || []; }
    const mapped = rows.map((row) => enriched ? ({ ...publicPhoto(row), published: row.published, collectionIds: links.filter((link) => link.photo_id === row.id).map((link) => link.collection_id) }) : publicPhoto(row));
    return NextResponse.json(id ? { photo: mapped[0] } : { photos: mapped });
  } catch { return errorResponse("Failed to load photos", 500); }
}

export async function patchHandler(request, { params, ...options } = {}) {
  try {
    const ready = await clients(options); if (ready.response) return ready.response;
    const id = sanitizePhotoId((await params)?.id || options.id);
    const input = await request.json();
    const collectionIds = Object.hasOwn(input || {}, "collectionIds") ? input.collectionIds : undefined;
    if (collectionIds !== undefined && (!Array.isArray(collectionIds) || collectionIds.some((value) => typeof value !== "string"))) return errorResponse("Invalid collectionIds", 400);
    if (collectionIds !== undefined && (collectionIds.length > 50 || new Set(collectionIds).size !== collectionIds.length || collectionIds.some((value) => !UUID.test(value)))) return errorResponse("Invalid collectionIds", 400);
    const update = Object.fromEntries(fields.filter((key) => Object.hasOwn(input || {}, key)).map((key) => [key, input[key]]));
    // Empty date inputs come from the browser form when no date is set. An
    // empty string cannot be cast to Postgres DATE, so store it as NULL.
    if (update.photo_date === "") update.photo_date = null;
    for (const [key, value] of Object.entries(update)) {
      if (key === "published") { if (typeof value !== "boolean") return errorResponse("Invalid published", 400); } else if (key === "photo_date" && value === null) continue; else if (typeof value !== "string" || value.length > 500) return errorResponse(`Invalid ${key}`, 400);
    }
    if (update.photo_date && !/^\d{4}-\d{2}-\d{2}$/.test(update.photo_date)) return errorResponse("Invalid photo_date", 400);
    if (update.aspect && !["landscape", "portrait", "square", "wide", "tall"].includes(update.aspect)) return errorResponse("Invalid aspect", 400);
    if (!Object.keys(update).length && collectionIds === undefined) return errorResponse("No editable metadata supplied", 400);
    let data = null; let error = null; let existingCollectionIds = collectionIds;
    if (Object.keys(update).length) ({ data, error } = await ready.adminClient.from("photos").update(update).eq("id", id).select().single());
    if (error) { console.error("Admin photo update failed", { id, error }); return errorResponse("Failed to update photo", 500); }
    if (collectionIds !== undefined) {
      let replaced;
      if (typeof ready.adminClient.rpc !== "function") return errorResponse("Photo collection updates are unavailable", 503);
      replaced = await ready.adminClient.rpc("replace_photo_collections", { p_photo_id: id, p_collection_ids: collectionIds });
      if (replaced?.error) {
        // Older projects may not have the RPC deployed yet. The service-role
        // client can safely perform the same replacement directly.
        console.error("Admin photo collection RPC failed; using direct replacement", { id, error: replaced.error });
        const relation = ready.adminClient.from("collection_photos");
        const cleared = await relation.delete().eq("photo_id", id);
        if (cleared?.error) return errorResponse("Failed to update photo collections", 500);
        if (collectionIds.length) {
          const inserted = await relation.insert(collectionIds.map((collectionId, index) => ({ collection_id: collectionId, photo_id: id, sort_order: index })));
          if (inserted?.error) return errorResponse("Failed to update photo collections", 500);
        }
      }
    }
    if (!data) { const found = await ready.adminClient.from("photos").select("*").eq("id", id).single(); data = found.data; }
    if (existingCollectionIds === undefined) { const links = await ready.adminClient.from("collection_photos").select("collection_id").eq("photo_id", id); existingCollectionIds = (links.data || []).map((link) => link.collection_id); }
    return NextResponse.json({ photo: { ...publicPhoto(data), published: data.published, collectionIds: existingCollectionIds || [] } });
  } catch (error) { return errorResponse(error.message === "Invalid photo id or path" ? error.message : "Invalid request", 400); }
}

export async function deleteHandler(request, { params, ...options } = {}) {
  try {
    const ready = await clients(options); if (ready.response) return ready.response;
    const id = sanitizePhotoId((await params)?.id || options.id);
    const url = new URL(request.url);
    if (url.searchParams.get("confirm") !== "true") return errorResponse("Explicit confirmation is required", 400);
    const found = await ready.adminClient.from("photos").select("*").eq("id", id).single();
    if (found.error || !found.data) return errorResponse("Photo not found", 404);
    const deleted = await ready.adminClient.from("photos").delete().eq("id", id);
    if (deleted.error) return errorResponse("Failed to delete photo record", 500);
    const collections = ready.adminClient.from("photo_collections");
    if (typeof collections.update === "function") { const cleared = await collections.update({ cover_photo_id: "" }).eq("cover_photo_id", id); if (cleared?.error) return errorResponse("Photo deleted, but collection cover cleanup failed", 500); }
    const paths = storagePathsFor(id);
    const removed = await Promise.all([ready.adminClient.storage.from("photo-previews").remove([paths.preview]), ready.adminClient.storage.from("photo-originals").remove([paths.original])]);
    const storageError = removed.find((result) => result?.error);
    if (storageError) return errorResponse("Photo record deleted, but storage cleanup failed", 500);
    return NextResponse.json({ deleted: true });
  } catch { return errorResponse("Failed to delete photo", 500); }
}

export async function GET(request, context) { return getHandler(request, context); }
export async function PATCH(request, context) { return patchHandler(request, context); }
export async function DELETE(request, context) { return deleteHandler(request, context); }
