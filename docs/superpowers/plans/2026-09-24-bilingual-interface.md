# Bilingual Interface Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an English-first, Chinese-switchable interface while preserving all long-form content in its original language.

**Architecture:** Introduce a client-side locale provider and a focused translation dictionary. The root layout supplies the provider; UI components read locale-aware strings through a shared hook. Content files that represent original writing, papers, reading notes, finance notes, and technology lists are left unchanged.

**Tech Stack:** Next.js App Router, React Context, Tailwind CSS, Framer Motion.

---

## File structure

- Create `components/LocaleProvider.jsx` — stores `en` or `zh`, persists it in local storage, and exports `useLocale`.
- Create `lib/translations.js` — English and Chinese interface copy grouped by page and component.
- Modify `app/layout.jsx` — wrap the app in `LocaleProvider`.
- Modify `components/Navbar.jsx` — add the `EN | 中` segmented control and translate navigation labels and accessibility labels.
- Modify `app/(root)/page.jsx`, `app/about/page.jsx`, `app/projects/page.jsx`, `app/projects/[slug]/page.jsx`, `app/writing/page.jsx`, `app/writing/technology/page.jsx`, `app/writing/literature/page.jsx`, `app/journal/page.jsx`, `app/journal/milestones/page.jsx`, `app/journal/reading/page.jsx`, `app/journal/money/page.jsx`, `components/JournalCards.jsx`, `components/ContactOrbit.jsx`, and `components/Footer.jsx` — replace interface copy with translated strings while keeping original long-form content untouched.

### Task 1: Locale state and dictionary

**Files:**
- Create: `components/LocaleProvider.jsx`
- Create: `lib/translations.js`
- Modify: `app/layout.jsx`

- [ ] **Step 1: Define the expected locale contract**

Create a small testable API contract in `components/LocaleProvider.jsx`: `locale` is always `"en"` or `"zh"`; `setLocale` accepts only those values; `t(path)` resolves a nested translation key and falls back to the English value when a Chinese key is absent.

- [ ] **Step 2: Implement the translation dictionary**

Create `lib/translations.js` with this shape:

```jsx
export const translations = {
  en: { nav: { home: "Home", about: "About" } },
  zh: { nav: { home: "首页", about: "关于" } },
};
```

Include copy for all currently rendered UI labels, CTAs, section titles, contact labels, project metadata labels, journal card summaries, and empty-state messages. Do not add article, note, paper, or book content to this dictionary.

- [ ] **Step 3: Implement browser persistence safely**

Use a client component that initializes to `"en"`, reads `localStorage.getItem("undefinedyou-locale")` after mount, and writes the selected value after a user switch.

```jsx
const [locale, setLocaleState] = useState("en");
const setLocale = (nextLocale) => {
  if (nextLocale === "en" || nextLocale === "zh") setLocaleState(nextLocale);
};
```

Use `useMemo` for the context value and guard all `localStorage` access inside effects so server rendering stays deterministic.

- [ ] **Step 4: Mount the provider at the root**

Wrap `ClientTopProgressBar`, `Navbar`, and `{children}` with `LocaleProvider` in `app/layout.jsx` so every page reads one shared locale.

- [ ] **Step 5: Verify the contract and build**

Run:

```bash
pnpm build
```

Expected: production build completes with no locale-related lint or type errors.

- [ ] **Step 6: Commit**

```bash
git add components/LocaleProvider.jsx lib/translations.js app/layout.jsx
git commit -m "feat: add persistent interface locale"
```

### Task 2: Navigation language control

**Files:**
- Modify: `components/Navbar.jsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Add locale-aware navigation copy**

Read `locale`, `setLocale`, and `t` from `useLocale`. Replace hard-coded menu strings, `Go back`, and menu open/close labels with dictionary values.

- [ ] **Step 2: Add the segmented switcher**

Render two buttons before the hamburger control:

```jsx
<div role="group" aria-label={t("locale.label")} className="flex overflow-hidden rounded-full border border-ink/25 p-0.5 text-[10px] font-mono tracking-[0.16em]">
  {[["en", "EN"], ["zh", "中"]].map(([value, label]) => (
    <button key={value} type="button" onClick={() => setLocale(value)} aria-pressed={locale === value} className={locale === value ? "rounded-full bg-ink px-2.5 py-1 text-cream" : "rounded-full px-2.5 py-1 text-muted"}>{label}</button>
  ))}
</div>
```

Keep the existing hamburger button reachable on narrow screens and retain the current `z-[100]` layering.

- [ ] **Step 3: Check navigation behavior manually**

At desktop and 405px viewport widths: open the menu, switch each language, then navigate to About, Projects, Writing, Journal, and Contact. Expected: current page location remains stable during language switching and each menu route still targets its matching section.

- [ ] **Step 4: Commit**

```bash
git add components/Navbar.jsx app/globals.css
git commit -m "feat: add bilingual navigation switcher"
```

### Task 3: Translate home and short presentation components

**Files:**
- Modify: `app/(root)/page.jsx`
- Modify: `components/JournalCards.jsx`
- Modify: `components/ContactOrbit.jsx`
- Modify: `components/Footer.jsx`

- [ ] **Step 1: Translate home-section UI strings**

Make `HomePage`, `SectionMark`, `QuietLink`, and `ScrollIndicator` consume `t`. Translate only labels and summaries: section marks, hero subtitle, section headings, cards, calls to action, and contact presentation labels. Leave project descriptions from `json/data.json` in their original language.

- [ ] **Step 2: Translate journal and contact component chrome**

Translate journal category captions, card summaries, contact labels, disclosure labels, and footer wording. Keep email addresses, GitHub handle, Xiaohongshu image, X placeholder state, and the original journal entries unchanged.

- [ ] **Step 3: Verify content boundary**

Switch between EN and 中 on the home page. Expected: `Not everything needs to be defined.` changes to its Chinese interface translation, while the project title `铺记`, technology tags, email addresses, and source article titles do not change.

- [ ] **Step 4: Commit**

```bash
git add 'app/(root)/page.jsx' components/JournalCards.jsx components/ContactOrbit.jsx components/Footer.jsx
git commit -m "feat: translate home and presentation copy"
```

### Task 4: Translate page-level interface chrome

**Files:**
- Modify: `app/about/page.jsx`
- Modify: `app/projects/page.jsx`
- Modify: `app/projects/[slug]/page.jsx`
- Modify: `app/writing/page.jsx`
- Modify: `app/writing/technology/page.jsx`
- Modify: `app/writing/literature/page.jsx`
- Modify: `app/journal/page.jsx`
- Modify: `app/journal/milestones/page.jsx`
- Modify: `app/journal/reading/page.jsx`
- Modify: `app/journal/money/page.jsx`

- [ ] **Step 1: Translate static page labels and summaries**

Replace hard-coded headings, section markers, CTA labels, metadata labels such as `Project`, `Technology`, `Year`, `Description`, `Download PDF`, and page introductions with `t` calls.

- [ ] **Step 2: Preserve all original content**

Do not change values loaded from `json/data.json`, `json/milestones.json`, `json/writing.json`, `lib/reading.js`, or `lib/finance.js`. Keep the paper title `被忽略的注视：论阿城《棋王》中的同性目光` and all reading and finance note bodies exactly as written.

- [ ] **Step 3: Test route persistence and downloads**

Open `/about`, `/projects/puji`, `/writing/literature`, `/journal/reading`, and `/journal/money`. Toggle both languages on each page. Expected: no route changes, the title and body of original works remain unchanged, and `/papers/qi-wang-lu-jingliang.pdf` still downloads.

- [ ] **Step 4: Run the production build**

Run:

```bash
pnpm build
```

Expected: all routes generate successfully.

- [ ] **Step 5: Commit**

```bash
git add app/about/page.jsx app/projects/page.jsx 'app/projects/[slug]/page.jsx' app/writing/page.jsx app/writing/technology/page.jsx app/writing/literature/page.jsx app/journal/page.jsx app/journal/milestones/page.jsx app/journal/reading/page.jsx app/journal/money/page.jsx
git commit -m "feat: translate page interface copy"
```

### Task 5: Local acceptance review

**Files:**
- Modify: none unless verification uncovers a defect

- [ ] **Step 1: Start a local production-like preview**

Run:

```bash
pnpm dev
```

Open the home page and test the `EN | 中` control at desktop and mobile widths.

- [ ] **Step 2: Perform acceptance checks**

Verify that English is the initial language, a language selection persists after refresh, switching changes only UI copy, no heading overlaps at desktop or mobile widths, and links, menu state, back controls, project links, contact controls, and PDF download work.

- [ ] **Step 3: Record acceptance outcome**

Mark the acceptance review complete only after the checks above pass. If a defect appears, return to the task that owns the affected component, apply the smallest targeted correction, and rerun `pnpm build` before marking this task complete.
