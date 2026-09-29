# Photography Admin Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the photography admin page as a readable A-style editorial workbench with a sidebar, polished gallery, real upload queue, edit drawer, and usable batch actions.

**Architecture:** Keep the current Next.js client page and Supabase API contracts. Split the large client into focused navigation, gallery, uploader, batch toolbar, and edit drawer components; keep request orchestration in a small page-level hook/state module.

**Tech Stack:** Next.js 15, React, existing Tailwind/CSS classes, Supabase APIs, Node test runner, Vercel.

---

### Task 1: Establish the workbench shell and responsive typography

**Files:**
- Create: `components/photography/PhotoAdminShell.jsx`
- Create: `components/photography/photo-admin.css`
- Modify: `components/photography/PhotoAdminClient.jsx`
- Test: `components/photography/PhotoAdminClient.test.js`

- [ ] Add semantic shell regions: `<aside>`, top bar, `<main>`, responsive drawer toggle, active navigation state, and logout action.
- [ ] Add CSS variables for cream background, ink text, olive accent, border and spacing; add `font-size`, `line-height`, `overflow-wrap`, focus rings and mobile breakpoints that prevent title overlap.
- [ ] Render the existing photo list inside the shell without changing API behavior.
- [ ] Extend source-contract tests for `aria-current`, sidebar labels, focus-visible styles, and mobile drawer controls.
- [ ] Run `pnpm test` and confirm all existing tests pass before moving on.

### Task 2: Build the gallery, stats and stable filter toolbar

**Files:**
- Create: `components/photography/PhotoGallery.jsx`
- Create: `components/photography/PhotoStats.jsx`
- Modify: `components/photography/PhotoCmsFilters.jsx`
- Modify: `components/photography/PhotoAdminClient.jsx`
- Test: `components/photography/PhotoAdminClient.test.js`

- [ ] Add four stats cards for total, published, unpublished and recent uploads.
- [ ] Render photo cards with thumbnail, ID, location, collection labels, status badge and full-size touch targets for edit, publish toggle and delete.
- [ ] Keep search across ID/title/alt/location/notes and filter by published state and collection type.
- [ ] Add loading skeleton, empty state and inline error state; do not use a blank page or browser alert for failures.
- [ ] Add tests for stable filter labels, card action labels and empty/loading states.
- [ ] Run `pnpm test`.

### Task 3: Implement the upload workspace and queue

**Files:**
- Create: `components/photography/PhotoUploader.jsx`
- Modify: `components/photography/PhotoAdminClient.jsx`
- Modify: `app/api/admin/photos/route.js` only if folder metadata needs normalization
- Test: `components/photography/PhotoAdminClient.test.js`
- Test: `app/api/admin/photos/route.test.js` only for changed request fields

- [ ] Add drag-and-drop zone, file picker with `multiple` and `webkitdirectory`, selected-file preview rows, per-file status, retry button and remove button.
- [ ] Add shared title, location, date, aspect, bilingual description, published state and collection selection fields.
- [ ] Upload each file through the existing POST route, preserve per-file errors, and refresh the gallery only after successful uploads.
- [ ] Disable submit while a queue is active and show a completion summary.
- [ ] Add source tests for file input attributes, queue status and retry controls; run API and client tests.

### Task 4: Replace inline editing with an accessible edit drawer

**Files:**
- Modify: `components/photography/PhotoEditPanel.jsx`
- Create: `components/photography/PhotoEditDrawer.jsx`
- Modify: `components/photography/PhotoAdminClient.jsx`
- Test: `components/photography/PhotoAdminClient.test.js`

- [ ] Move the existing complete metadata form into a right-side drawer with preview and a sticky footer.
- [ ] Preserve `collectionIds` whenever PATCH payloads omit collection changes.
- [ ] Show save errors inside the drawer, track dirty state, and confirm before discarding unsaved edits.
- [ ] Add keyboard close support and dialog labels; ensure fields have visible labels.
- [ ] Run `pnpm test` and `CONTENT_SOURCE=local pnpm build`.

### Task 5: Implement the batch toolbar and collection actions

**Files:**
- Create: `components/photography/PhotoBatchToolbar.jsx`
- Modify: `components/photography/PhotoAdminClient.jsx`
- Test: `components/photography/PhotoAdminClient.test.js`

- [ ] Add select-all/clear-selection and selected-count controls.
- [ ] Add batch publish, unpublish and collection replacement actions using the existing PATCH route and `replace_photo_collections` RPC path.
- [ ] Keep failed IDs selected and show an inline summary of successes and failures.
- [ ] Ensure toolbar appears only when selection exists and remains usable on mobile.
- [ ] Run all tests and production build.

### Task 6: Visual verification and deployment

**Files:**
- Modify: `components/photography/photo-admin.css` only for verified polish fixes
- Modify: `components/photography/PhotoAdminClient.test.js` for final contracts

- [ ] Verify desktop and narrow viewport screenshots: no title clipping, no overlapping controls, readable Chinese labels, and usable button hit areas.
- [ ] Run `pnpm test` and `CONTENT_SOURCE=local pnpm build`.
- [ ] Deploy with `npx vercel --prod`.
- [ ] Open `/photography/admin` in the authenticated browser, wait for photos to load, and verify gallery, upload tab and batch toolbar are visible.
