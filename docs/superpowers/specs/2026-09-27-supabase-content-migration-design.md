# Supabase Content Migration Design

## Goal

Add a reversible Supabase-backed content workflow for the structured parts of undefinedyou while preserving the current Git-based Markdown/MDX workflow and all existing local content as a fallback.

## Scope

The first migration covers four structured content domains:

- Projects currently represented by `json/data.json`.
- Courses currently represented by `lib/courses.js` and the supplied course information files.
- Short Journal entries currently represented by `json/journal.json`.
- Photography metadata and collections currently represented by `lib/photos.js`, `lib/photo-library.js`, and `lib/workshop-library.js`.

The first migration does not move long-form MDX articles, reading notes, finance notes, original photographs, CV files, or paper PDFs. Existing local files remain in the repository and remain usable as a fallback until the database path has been verified.

## Architecture

Supabase provides PostgreSQL, Storage, and Auth. Next.js reads published content through a small repository/content-access layer instead of calling Supabase directly from page components. The repository layer will have a local source and a Supabase source with the same return shapes, allowing the application to switch sources through configuration and making rollback possible.

The first release is single-owner. Public visitors can read published records only. The owner authenticates before using `/admin`; unpublished records and all write operations are restricted to the owner. Original photos remain outside Supabase. Only web-sized derivatives are uploaded to Storage, while the database stores URLs and metadata.

## Data model

The initial database model contains:

- `projects`: slug, title, descriptions, year, links, technologies, categories, featured flag, published flag, and timestamps.
- `courses`: code, title, term, institution, instructor, description, notes URL, published flag, and timestamps.
- `journal_entries`: slug, date, title, short note, photo URL, location, tags, published flag, and timestamps.
- `photo_collections`: slug, type (`theme` or `workshop`), bilingual titles and introductions, date range, locations, published flag, and timestamps.
- `photos`: stable ID, storage URL, alt text, date, locations, notes, aspect, published flag, and timestamps.
- `collection_photos`: collection-to-photo relation with explicit sort order.

The model will preserve stable slugs and photo IDs from the current files so existing routes and links remain compatible. Missing source values remain empty or explicitly marked as pending; migration will not invent course or photo metadata.

## Data flow

1. Import scripts read the current local data and write an idempotent snapshot to Supabase.
2. Import verification compares record counts, stable IDs, slugs, and key fields against the local source.
3. The application continues to use the local source until verification passes.
4. A configuration switch enables the Supabase source for one domain at a time.
5. The local source remains available for immediate rollback.
6. Export scripts can reconstruct the current JSON/JavaScript-compatible shapes from Supabase.

## Security

- Browser code uses only the Supabase publishable key.
- Secret/service keys are server-only and never committed.
- RLS is enabled for every exposed table.
- Anonymous reads are limited to `published = true` records.
- Admin writes require the authenticated owner identity.
- Storage buckets distinguish public derivatives from private assets.
- The admin route is not included in the sitemap.
- Database exports and original media remain part of the local backup workflow.

## Testing and verification

Before switching any page to Supabase, tests will verify:

- Imported counts match the local source.
- Stable IDs and slugs are preserved.
- A second import does not create duplicates.
- Unpublished records are excluded from public reads.
- Exported data can reconstruct the local fallback shape.
- Existing course and photography tests still pass.
- Production build succeeds with local-source mode enabled.

## Rollback

Rollback is a configuration change back to the local repository source. No migration step deletes local JSON, JavaScript, Markdown, MDX, photo, or PDF files. Supabase data can be exported as JSON/SQL and retained independently of the application.

## Explicit non-goals

- No full CMS for long-form MDX writing in the first release.
- No public multi-user authoring.
- No upload of original DNG or full-resolution photo archives.
- No deletion of the current Git-tracked content.
- No automatic destructive synchronization from Supabase back to the repository.
