# Photography Section Design

## Goal

Replace Journal's third financial card with a Photography card. The photography page opens directly into a photo gallery and can switch to themed photo stories without navigating away.

## Information architecture

- Journal card 03 becomes `Photography / 摄影` and links to `/journal/photography`.
- The previous finance card, its copy, and the `/journal/money` navigation entry are removed from Journal surfaces.
- `/journal/photography` has one page with two display modes:
  - **Gallery** is the default mode and shows individual photographs.
  - **Themes** shows photo stories for activities, events, trips, or other connected moments.

## Gallery mode

- The page opens directly to the Gallery wall; there is no intermediate landing page.
- Images use a responsive editorial masonry grid. Portrait and landscape images retain their own aspect ratios.
- A photo caption is intentionally compact: date, place, and a short note.
- On pointer devices, caption content fades in at the lower edge of a photograph on hover or focus.
- Selecting an image opens an immersive viewer with the full image, caption, and previous/next navigation.

## Themes mode

- A two-option segmented control in the page header switches between `Gallery` and `Themes`.
- Each story card contains a title, date range, location, short introduction, and a two- or three-image preview strip.
- Selecting a story opens a dedicated story route containing its short introductory note and the full sequence of images.
- Gallery images and story previews can reference the same source image records.

## Motion and interaction

- The segmented control updates the page in place and preserves scroll position.
- Shared images use layout-aware motion when possible: existing images move and resize into their next positions.
- Images entering a mode use a short opacity and vertical-offset transition. Removed items fade out before their space collapses.
- Motion duration is approximately 280–420 ms with an ease-out curve. `prefers-reduced-motion` removes spatial movement and uses a brief opacity transition.
- Viewer open/close uses the selected image as the visual origin, with a backdrop fade and no full-page flash.

## Data model

Each image record has:

- `id`
- `src`
- `alt`
- `date`
- `location`
- `note`
- `aspect` (portrait, landscape, or square)
- optional `themeId`

Each theme record has:

- `id`
- `title`
- `dateRange`
- `location`
- `intro`
- ordered `imageIds`

No placeholder photographs will be represented as finished work. Until the owner supplies image files, the page will use an unobtrusive empty state that explains that the first photographs are being selected.

## Bilingual content

- Interface labels, section titles, accessibility text, and empty states use the site's existing English-first bilingual translation system.
- Captions and story notes remain in the original language supplied with each photograph.

## Validation

- Verify the Journal card changes to Photography and no finance card appears on Journal pages.
- Verify `/journal/photography` opens in Gallery mode.
- Verify the Gallery/Themes control switches in place and respects reduced-motion preferences.
- Verify keyboard focus reaches the mode control, photo items, viewer controls, and story cards.
- Verify a production build succeeds.
