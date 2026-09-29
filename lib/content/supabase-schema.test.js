import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const migrationPath = new URL("../../supabase/migrations/001_content_schema.sql", import.meta.url);
const photoStorageMigrationPath = new URL("../../supabase/migrations/003_photo_storage.sql", import.meta.url);

test("content migration defines all structured content tables", () => {
  const sql = fs.readFileSync(migrationPath, "utf8");
  for (const table of ["projects", "courses", "journal_entries", "photo_collections", "photos", "collection_photos"]) {
    assert.match(sql, new RegExp(`create table if not exists ${table}`, "i"));
  }
});

test("content migration protects public tables with stable keys, publication state, and RLS", () => {
  const sql = fs.readFileSync(migrationPath, "utf8");
  for (const table of ["projects", "courses", "journal_entries", "photo_collections", "photos", "collection_photos"]) {
    assert.match(sql, new RegExp(`alter table ${table} enable row level security`, "i"));
  }
  for (const column of ["published", "created_at", "updated_at"]) {
    assert.match(sql, new RegExp(`\\b${column}\\b`, "i"));
  }
  assert.match(sql, /slug\s+text\s+not null\s+unique/i);
  assert.match(sql, /code\s+text\s+not null\s+unique/i);
});

test("photo storage migration separates public previews from private originals", () => {
  const sql = fs.readFileSync(photoStorageMigrationPath, "utf8");

  assert.match(sql, /add column if not exists original_path text not null default ''/i);
  assert.match(sql, /insert into storage\.buckets/i);
  assert.match(sql, /\('photo-previews',\s*'photo-previews',\s*true\)/i);
  assert.match(sql, /\('photo-originals',\s*'photo-originals',\s*false\)/i);
  assert.match(sql, /for\s+select\s+to\s+anon,\s+authenticated\s+using\s*\(bucket_id\s*=\s*'photo-previews'\)/i);
  assert.doesNotMatch(sql, /for select[\s\S]*bucket_id\s*=\s*'photo-originals'/i);
});
