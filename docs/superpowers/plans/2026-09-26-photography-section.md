# Photography Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an image-first Photography section to Journal with a time-ordered Gallery, Themes, and Workshops, seeded with the supplied photos.

**Architecture:** `lib/photos.js` owns image and collection metadata. A client browser component reads that data and changes mode without route changes. Dynamic collection routes reuse the same data for full photo sequences.

**Tech Stack:** Next.js App Router, React, Framer Motion, Tailwind CSS, Node test runner, JPEG assets.

---

### Task 1: Prepare browser-safe image assets

**Files:**
- Create: `public/photos/themes/landscape/autumn-courtyard.jpeg`
- Create: `public/photos/themes/landscape/river-bridge.jpg`
- Create: `public/photos/workshops/2025-midautumn-fair/midautumn-fair.jpg`

- [ ] **Step 1: Create the asset directories**

```bash
mkdir -p public/photos/themes/landscape public/photos/workshops/2025-midautumn-fair
```

- [ ] **Step 2: Copy the supplied JPEG files without altering them**

```bash
cp /Users/francis/Desktop/IMG_20230801_0147.jpeg public/photos/themes/landscape/autumn-courtyard.jpeg
cp /Users/francis/Desktop/IMG_4180.JPG public/photos/themes/landscape/river-bridge.jpg
```

- [ ] **Step 3: Convert the supplied DNG to browser-readable JPEG**

```bash
sips -s format jpeg /Users/francis/Pictures/大学照片存档/2025.9.20大一时期-逸夫中秋游园活动/原始文件/DSC00004.dng --out public/photos/workshops/2025-midautumn-fair/midautumn-fair.jpg
```

Expected: all three public assets report nonzero dimensions with `sips -g pixelWidth -g pixelHeight <asset>`; the source DNG remains unchanged.

- [ ] **Step 4: Commit the asset addition**

```bash
git add public/photos && git commit -m "feat: add initial photography assets"
```

### Task 2: Define photography data with test-first coverage

**Files:**
- Create: `lib/photos.test.js`
- Create: `lib/photos.js`

- [ ] **Step 1: Write `lib/photos.test.js` before production data**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { galleryPhotos, photoThemes, photoWorkshops } from "./photos.js";

test("gallery is newest first and each photo belongs to a collection", () => {
  assert.deepEqual(galleryPhotos.map((photo) => photo.id), ["midautumn-fair", "river-bridge", "autumn-courtyard"]);
  assert.ok(galleryPhotos.every((photo) => photo.collectionType && photo.collectionSlug));
});

test("initial theme and workshop reference supplied photographs", () => {
  assert.deepEqual(photoThemes[0].imageIds, ["river-bridge", "autumn-courtyard"]);
  assert.deepEqual(photoWorkshops[0].imageIds, ["midautumn-fair"]);
});
```

- [ ] **Step 2: Verify the test fails because `lib/photos.js` is absent**

Run: `node --test lib/photos.test.js`

Expected: FAIL with a module-not-found error.

- [ ] **Step 3: Create `lib/photos.js`**

Export `galleryPhotos`, `photoThemes`, `photoWorkshops`, and `photosFor(ids)`. Every photo must contain `id`, `src`, `alt`, `date`, `location`, `note`, `aspect`, `collectionType`, and `collectionSlug`. Use `midautumn-fair`, `river-bridge`, and `autumn-courtyard` IDs. Keep Gallery ordering newest first. Put the two landscape images in the `landscape` Theme. Put the DNG-derived image in the `2025-midautumn-fair` Workshop with date `2025-09-20`, title `Shaw College Mid-Autumn Fair`, and the supplied Chinese title `逸夫中秋游园活动`.

- [ ] **Step 4: Verify the metadata contract passes**

Run: `node --test lib/photos.test.js`

Expected: 2 tests pass and 0 fail.

- [ ] **Step 5: Commit the data model**

```bash
git add lib/photos.js lib/photos.test.js && git commit -m "feat: add photography data model"
```

### Task 3: Build the animated Photography page

**Files:**
- Create: `components/PhotographyBrowser.jsx`
- Create: `app/journal/photography/page.jsx`
- Modify: `lib/translations.js`

- [ ] **Step 1: Add translation keys**

Add an English-first `photography` object to both locales. It needs `label`, `title`, `summary`, `gallery`, `themes`, `workshops`, `viewCollection`, `close`, `previous`, `next`, `noDate`, and `noLocation`. Use Chinese equivalents including `摄影`, `作品墙`, `主题`, `活动`, `查看图集`, `关闭图片`, `上一张`, and `下一张`.

- [ ] **Step 2: Implement `PhotographyBrowser.jsx`**

The component takes `photos`, `themes`, and `workshops`; initializes mode to `gallery`; and uses a `Gallery | Themes | Workshops` segmented control with `aria-pressed` state. Gallery renders an editorial responsive photo wall in received order. Themes and Workshops render separate card grids with preview strips. Use `LayoutGroup`, `motion` `layout`, `AnimatePresence`, 280–420ms ease-out transitions, and `motion-reduce:transition-none`. A selected image opens a keyboard-accessible dialog with full image, caption, previous/next, and close controls. Captions omit absent fields rather than showing invented information.

- [ ] **Step 3: Add the page route**

```jsx
import PhotographyBrowser from "@/components/PhotographyBrowser";
import { galleryPhotos, photoThemes, photoWorkshops } from "@/lib/photos";

export default function PhotographyPage() {
  return <PhotographyBrowser photos={galleryPhotos} themes={photoThemes} workshops={photoWorkshops} />;
}
```

- [ ] **Step 4: Verify page compilation**

```bash
node --test lib/photos.test.js && pnpm build
```

Expected: tests and production build pass.

- [ ] **Step 5: Commit the page**

```bash
git add components/PhotographyBrowser.jsx app/journal/photography/page.jsx lib/translations.js && git commit -m "feat: add animated photography gallery"
```

### Task 4: Add collection pages and Journal integration

**Files:**
- Create: `app/journal/photography/[kind]/[slug]/page.jsx`
- Modify: `components/JournalCards.jsx`

- [ ] **Step 1: Implement the dynamic collection page**

Resolve `kind` from `themes` or `workshops`, resolve the collection by slug, and call `notFound()` if no valid collection exists. Use `photosFor(collection.imageIds)` to render title, workshop date/location when present, introduction, and the complete responsive image sequence.

- [ ] **Step 2: Replace Journal card 03**

Replace the money object in `sectionKeys` with:

```js
{
  number: "03",
  title: "photography.title",
  label: "photography.label",
  description: "photography.summary",
  href: "/journal/photography",
}
```

The old money card must not render from `sectionKeys`.

- [ ] **Step 3: Verify routes locally**

Open `/journal`, `/journal/photography`, `/journal/photography/themes/landscape`, and `/journal/photography/workshops/2025-midautumn-fair`. Verify that Journal contains no finance card, Gallery opens first, all three modes switch in place, and collection cards open their routes.

- [ ] **Step 4: Commit Journal integration**

```bash
git add app/journal/photography/[kind]/[slug]/page.jsx components/JournalCards.jsx && git commit -m "feat: connect photography to journal"
```

### Task 5: Final local verification

**Files:**
- Verify: `lib/photos.test.js`
- Verify: `components/PhotographyBrowser.jsx`
- Verify: `app/journal/photography/page.jsx`

- [ ] **Step 1: Run focused tests**

```bash
node --test lib/courses.test.js lib/photos.test.js
```

Expected: 4 tests pass and 0 fail.

- [ ] **Step 2: Run a production build**

Run: `pnpm build`

Expected: exit code 0 and a generated `/journal/photography` route.

- [ ] **Step 3: Inspect source changes**

```bash
git diff --check && git status --short
```

Expected: no whitespace errors. Do not push or deploy.

- [ ] **Step 4: Open the local preview**

Open `http://localhost:3005/journal/photography` for owner review.
