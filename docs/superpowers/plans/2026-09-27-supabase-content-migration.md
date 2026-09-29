# Supabase Content Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reversible Supabase-backed content workflow for projects, courses, Journal entries, and photography metadata while preserving all local files as the fallback source.

**Architecture:** Introduce a content repository boundary with a local implementation first and a Supabase implementation behind an explicit environment switch. Add SQL migrations, import/export tooling, and a single-owner admin surface only after the local repository contract is tested. Long-form MDX and original media remain file-based.

**Tech Stack:** Next.js 15 App Router, React 19, Node test runner, Supabase PostgreSQL/Auth/Storage, `@supabase/ssr`, SQL migrations, existing JSON/JS/MDX content.

---

### Task 1: Define the content repository contract

**Files:**
- Create: `lib/content/types.js`
- Create: `lib/content/local-source.js`
- Create: `lib/content/repository.js`
- Create: `lib/content/repository.test.js`
- Modify: `lib/courses.js`
- Modify: `lib/photos.js`

- [ ] **Step 1: Write the failing tests**

Add tests asserting that the local source returns the existing project, course, Journal, photography, theme, and workshop shapes; that project and Journal slugs are stable; and that the repository defaults to the local source when `CONTENT_SOURCE` is unset.

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `node --test lib/content/repository.test.js`

Expected: FAIL because the content repository modules do not exist.

- [ ] **Step 3: Implement the local source and repository switch**

Create named functions `getProjects`, `getCourses`, `getJournalEntries`, `getPhotos`, `getPhotoThemes`, and `getPhotoWorkshops`. The local source must read existing modules without changing their data values. The repository must select `local` unless `CONTENT_SOURCE=supabase` is explicitly set, and must throw a clear configuration error if Supabase mode is selected before the Supabase adapter exists.

- [ ] **Step 4: Run the focused tests**

Run: `node --test lib/content/repository.test.js lib/courses.test.js lib/photos.test.js`

Expected: all tests pass.

- [ ] **Step 5: Commit the isolated contract change when repository permissions allow**

Run: `git add lib/content lib/courses.js lib/photos.js && git commit -m "refactor: add reversible content repository boundary"`

If Git index permissions remain unavailable, leave the files unchanged after verification and report the environment limitation.

### Task 2: Add Supabase schema and local environment wiring

**Files:**
- Create: `supabase/migrations/001_content_schema.sql`
- Create: `supabase/seed/README.md`
- Modify: `.env.example`
- Modify: `package.json`
- Create: `lib/content/supabase-schema.test.js`

- [ ] **Step 1: Write the failing schema contract test**

Add a static contract test that checks the migration contains tables `projects`, `courses`, `journal_entries`, `photo_collections`, `photos`, and `collection_photos`; unique keys for project/course/Journal slugs or codes; `published` columns; timestamps; and RLS enablement statements for every exposed table.

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test lib/content/supabase-schema.test.js`

Expected: FAIL because the migration file does not exist.

- [ ] **Step 3: Write the minimal SQL migration**

Create UUID primary keys where useful, preserve current stable slugs and photo IDs as unique text fields, use `text[]` for technologies/tags where appropriate, add `created_at` and `updated_at`, create the collection relation table with an ordering column, enable RLS on every table, and add indexes for `published`, `slug`, `date`, and collection lookup.

- [ ] **Step 4: Add environment names and scripts**

Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, and `CONTENT_SOURCE=local` to `.env.example`. Add only the required Supabase client dependency and scripts for applying migrations/importing/exporting after the implementation files exist.

- [ ] **Step 5: Run the schema contract test**

Run: `node --test lib/content/supabase-schema.test.js`

Expected: PASS.

### Task 3: Build the Supabase server adapter

**Files:**
- Create: `lib/content/supabase-server.js`
- Create: `lib/content/supabase-source.js`
- Create: `lib/content/supabase-source.test.js`

- [ ] **Step 1: Write failing adapter tests**

Test that the adapter refuses to initialize without server credentials, maps Supabase rows into the local repository shapes, filters public reads to `published=true`, and does not expose a secret key through a client-facing module.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test lib/content/supabase-source.test.js`

Expected: FAIL because the adapter does not exist.

- [ ] **Step 3: Implement server-only Supabase access**

Create the server client using the server-only secret key. Implement read functions matching the local repository contract. Keep imports in server-only modules and throw descriptive errors for missing environment variables. Do not add a browser client yet.

- [ ] **Step 4: Run all repository tests**

Run: `node --test lib/content/*.test.js lib/courses.test.js lib/photos.test.js`

Expected: PASS.

### Task 4: Create idempotent import and export tooling

**Files:**
- Create: `scripts/content/normalize-local-content.mjs`
- Create: `scripts/content/import-to-supabase.mjs`
- Create: `scripts/content/export-from-supabase.mjs`
- Create: `scripts/content/content-transfer.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write failing transfer tests**

Test that local input normalizes to deterministic records, repeated imports use stable IDs/slugs and do not create duplicate records, and exported records reconstruct the fields required by the local repository.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test scripts/content/content-transfer.test.mjs`

Expected: FAIL because normalization and transfer modules do not exist.

- [ ] **Step 3: Implement normalization**

Read the existing JSON/JS modules and return deterministic JSON snapshots. Preserve empty fields as empty values, preserve all stable IDs, and never invent missing course or photo metadata.

- [ ] **Step 4: Implement import with upsert semantics**

Use stable slugs, course codes, photo IDs, and collection slugs as conflict keys. Upsert parent collections before relation rows. Make the command fail before writing if required environment variables are missing.

- [ ] **Step 5: Implement export**

Export each table and relation into a versioned JSON snapshot under a user-specified output directory. Do not overwrite an existing snapshot without an explicit output path.

- [ ] **Step 6: Run transfer tests**

Run: `node --test scripts/content/content-transfer.test.mjs`

Expected: PASS.

### Task 5: Add Supabase Auth and the protected admin shell

**Files:**
- Create: `lib/supabase/browser.js`
- Create: `lib/supabase/server.js`
- Create: `app/admin/layout.jsx`
- Create: `app/admin/page.jsx`
- Create: `app/admin/login/page.jsx`
- Create: `app/admin/actions.js`
- Create: `middleware.js`
- Create: `app/admin/admin.test.js`

- [ ] **Step 1: Write failing route/security tests**

Test that the admin route is not part of the public navigation, the admin shell requires an authenticated session, and the browser client uses only the publishable key.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test app/admin/admin.test.js`

Expected: FAIL because the admin route and auth helpers do not exist.

- [ ] **Step 3: Implement the minimal authenticated shell**

Add email/password or magic-link login through Supabase Auth, redirect unauthenticated users to `/admin/login`, and provide a signed-in placeholder dashboard showing source status and record counts. Keep all mutation actions server-side.

- [ ] **Step 4: Run tests and build in local mode**

Run: `node --test app/admin/admin.test.js lib/content/*.test.js lib/courses.test.js lib/photos.test.js && CONTENT_SOURCE=local pnpm build`

Expected: tests pass and the production build succeeds without Supabase credentials.

### Task 6: Migrate one domain first — Journal entries

**Files:**
- Create: `lib/content/journal-admin.js`
- Create: `app/admin/journal/page.jsx`
- Create: `app/admin/journal/actions.js`
- Modify: `app/journal/page.jsx`
- Create: `lib/content/journal-migration.test.js`

- [ ] **Step 1: Write failing Journal migration and rendering tests**

Test that the importer preserves the two existing Journal slugs, public reads exclude unpublished entries, and the admin form can create/update a Journal entry without changing local files.

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test lib/content/journal-migration.test.js`

Expected: FAIL because Journal Supabase reads and admin actions do not exist.

- [ ] **Step 3: Implement Journal read/write path**

Add the admin list and edit form, server actions with authenticated-owner checks, and a feature switch that allows Journal pages to read Supabase while all other domains remain local.

- [ ] **Step 4: Verify import, edit, rollback, and build**

Run: `pnpm content:import -- --domain journal`, edit one test record in the dashboard, verify it appears when `CONTENT_SOURCE_JOURNAL=supabase`, switch the flag back to local, and run `CONTENT_SOURCE=local pnpm build`.

Expected: both sources render and the local files remain unchanged.

### Task 7: Add projects, courses, and photography admin workflows

**Files:**
- Create: `app/admin/projects/page.jsx`
- Create: `app/admin/courses/page.jsx`
- Create: `app/admin/photography/page.jsx`
- Create: `app/admin/projects/actions.js`
- Create: `app/admin/courses/actions.js`
- Create: `app/admin/photography/actions.js`
- Modify: `app/projects/page.jsx`
- Modify: `app/academic/courses/page.jsx`
- Modify: `app/journal/photography/page.jsx`
- Create: domain-specific tests under `lib/content/`

- [ ] **Step 1: Write failing domain tests**

Cover project featured/published filtering, course code uniqueness and term grouping, photo upload metadata, collection ordering, and rollback to the local source.

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test lib/content/project-migration.test.js lib/content/course-migration.test.js lib/content/photo-migration.test.js`

Expected: FAIL because the domain admin workflows do not exist.

- [ ] **Step 3: Implement one domain at a time**

Reuse the authenticated admin shell and repository contract. Keep all writes server-side, use stable conflict keys, and preserve the current route shapes and localized display data.

- [ ] **Step 4: Run domain tests after each implementation**

Run: `node --test lib/content/*-migration.test.js lib/courses.test.js lib/photos.test.js`

Expected: PASS.

- [ ] **Step 5: Run the complete verification suite**

Run: `CONTENT_SOURCE=local pnpm build && node --test lib/content/*.test.js lib/courses.test.js lib/photos.test.js`

Expected: successful production build and all tests passing.

### Task 8: Document operations, backups, and rollback

**Files:**
- Create: `docs/supabase-content-operations.md`
- Modify: `README.md`
- Modify: `.env.example`
- Create: `scripts/content/README.md`

- [ ] **Step 1: Document setup**

Document creating a Supabase project, applying the SQL migration, creating public/private Storage buckets, configuring Auth, setting local environment variables, and importing a first snapshot.

- [ ] **Step 2: Document daily editing**

Document login, draft/publish behavior, photo derivative requirements, and how to export a backup.

- [ ] **Step 3: Document rollback**

Document switching the source flag back to local and restoring a JSON snapshot without deleting existing GitHub files.

- [ ] **Step 4: Final verification**

Run: `git diff --check && node --test lib/content/*.test.js lib/courses.test.js lib/photos.test.js && CONTENT_SOURCE=local pnpm build`

Expected: no whitespace errors, all tests pass, and the build succeeds.
