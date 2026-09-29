# Photo Storage Protection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Store original photographs privately in Supabase Storage while serving only public preview files to portfolio visitors.

**Architecture:** Add an `original_path` field to the existing `photos` table and create two Storage buckets: `photo-previews` (public) and `photo-originals` (private). A migration script copies current local images to both destinations without removing local files; public data APIs expose preview URLs only.

**Tech Stack:** Next.js, Supabase Postgres/Storage REST APIs, Node.js fetch, existing `.env.local` service-role credentials.

---

### Task 1: Add database and Storage policy migration

**Files:**
- Create: `supabase/migrations/003_photo_storage.sql`
- Test: `lib/content/supabase-schema.test.js`

- [ ] **Step 1: Write the failing schema test**

```js
assert.match(sql, /add column if not exists original_path text not null default ''/);
assert.match(sql, /insert into storage\.buckets/);
assert.match(sql, /photo-previews/);
assert.match(sql, /photo-originals/);
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test lib/content/supabase-schema.test.js`

Expected: FAIL because migration `003_photo_storage.sql` does not exist.

- [ ] **Step 3: Create the SQL migration**

```sql
alter table public.photos add column if not exists original_path text not null default '';

insert into storage.buckets (id, name, public)
values ('photo-previews', 'photo-previews', true), ('photo-originals', 'photo-originals', false)
on conflict (id) do update set public = excluded.public;

create policy "Public can read photo previews" on storage.objects
for select to anon, authenticated using (bucket_id = 'photo-previews');
```

Add an idempotent `do $$` block around policy creation and do not create a read policy for `photo-originals`.

- [ ] **Step 4: Run the schema test to verify it passes**

Run: `node --test lib/content/supabase-schema.test.js`

Expected: PASS.

### Task 2: Add an additive photo upload script

**Files:**
- Create: `scripts/migrate-photos-to-supabase-storage.mjs`
- Modify: `package.json`
- Test: `scripts/migrate-photos-to-supabase-storage.test.mjs`

- [ ] **Step 1: Write the failing path test**

```js
import { storagePathsFor } from './migrate-photos-to-supabase-storage.mjs';
assert.deepEqual(storagePathsFor('/photos/themes/landscape/a.webp'), {
  previewPath: 'themes/landscape/a.webp',
  originalPath: 'themes/landscape/a.webp',
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test scripts/migrate-photos-to-supabase-storage.test.mjs`

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement the uploader**

```js
export function storagePathsFor(sourcePath) {
  return { previewPath: sourcePath.replace(/^\/photos\//, ''), originalPath: sourcePath.replace(/^\/photos\//, '') };
}
```

For each `galleryPhotos` item, read the matching file under `public`, upload it to both buckets with `x-upsert: true`, then update `photos.storage_path` to the public preview URL and `photos.original_path` to the private object path. Do not delete local files.

- [ ] **Step 4: Add the package command**

```json
"photos:migrate": "node scripts/migrate-photos-to-supabase-storage.mjs"
```

- [ ] **Step 5: Run the unit test**

Run: `node --test scripts/migrate-photos-to-supabase-storage.test.mjs`

Expected: PASS.

### Task 3: Keep private paths out of public responses

**Files:**
- Modify: `lib/content/supabase-source.js`
- Modify: `app/api/content/route.js`
- Test: `lib/content/repository.test.js`

- [ ] **Step 1: Write the failing safety test**

```js
assert.equal(Object.hasOwn(photo, 'originalPath'), false);
assert.equal(Object.hasOwn(photo, 'original_path'), false);
```

- [ ] **Step 2: Implement the public mapping**

```js
return rows.map(({ original_path, ...photo }) => ({
  id: photo.id,
  src: photo.storage_path,
  alt: photo.alt,
  date: photo.photo_date || '',
  location: photo.location,
  locationZh: photo.location_zh,
  note: photo.note,
  noteZh: photo.note_zh,
  aspect: photo.aspect,
}));
```

- [ ] **Step 3: Run all content tests**

Run: `node --test lib/content/*.test.js`

Expected: PASS.

### Task 4: Apply and verify the live migration

**Files:**
- Modify: `supabase/seed/README.md`

- [ ] **Step 1: Execute `003_photo_storage.sql` in the Supabase SQL Editor**

Expected: Success with no rows returned.

- [ ] **Step 2: Run the uploader with service-role credentials**

Run: `set -a; source .env.local; set +a; pnpm photos:migrate`

Expected: a count of successfully mirrored images and zero local files deleted.

- [ ] **Step 3: Verify Storage and public API behavior**

Confirm `photo-previews` is public, `photo-originals` is private, and `/api/content` contains no original-file path.

- [ ] **Step 4: Run the production build in local fallback mode**

Run: `CONTENT_SOURCE=local pnpm build`

Expected: build succeeds; known image-element warnings are non-blocking.
