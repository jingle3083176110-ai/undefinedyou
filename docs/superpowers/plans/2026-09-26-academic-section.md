# Academic Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Writing area with an English first Academic section containing a coursework archive and an academic work collection.

**Architecture:** Store the supplied course roster as structured, testable data in `lib/courses.js`. Build `/academic`, `/academic/courses`, and `/academic/work` from focused components while retaining existing technology and literature pages as the destinations for academic work. Redirect `/writing` to `/academic/work` and update navigation and the home section to use the new academic structure.

**Tech Stack:** Next.js App Router, React 19, Tailwind CSS, Framer Motion, Node.js built in test runner.

---

## File Structure

- Create: `lib/courses.js` — course terms, official titles, and blank metadata fields.
- Create: `lib/courses.test.js` — validates term totals and metadata defaults.
- Create: `components/AcademicCards.jsx` — reusable two card Courses / Academic Work entry grid.
- Create: `components/CourseArchive.jsx` — client side term filter and expandable course rows.
- Create: `app/academic/page.jsx` — academic landing page.
- Create: `app/academic/courses/page.jsx` — coursework archive page.
- Create: `app/academic/work/page.jsx` — technology and literature collection index.
- Modify: `app/(root)/page.jsx` — replace Section 03 with Academic copy and `AcademicCards`.
- Modify: `components/Navbar.jsx`, `components/Sidebar.jsx` — label Section 03 as Academic.
- Modify: `lib/translations.js` — English and Chinese interface strings for Academic and Coursework.
- Modify: `app/writing/page.jsx` — permanent redirect to `/academic/work`.
- Modify: `app/writing/technology/page.jsx`, `app/writing/literature/page.jsx` — return links point to Academic Work.

### Task 1: Course Data Model

**Files:**
- Create: `lib/courses.js`
- Create: `lib/courses.test.js`

- [ ] **Step 1: Write the failing data contract test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { courseTerms, findCourse } from "./courses.js";

test("course roster keeps all four terms and the supplied 22 courses", () => {
  assert.deepEqual(courseTerms.map((term) => term.id), ["2025-t1", "2025-t2", "2025-summer", "2026-t1"]);
  assert.equal(courseTerms.flatMap((term) => term.courses).length, 22);
  assert.equal(findCourse("CSC3200").title, "Data Structures and Advanced Programming");
});

test("unsupplied course metadata remains intentionally empty", () => {
  const course = findCourse("MAT1002");
  assert.equal(course.instructor, null);
  assert.equal(course.description, null);
  assert.equal(course.notesUrl, null);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test lib/courses.test.js`

Expected: failure because `lib/courses.js` does not exist.

- [ ] **Step 3: Add the structured roster**

```js
export const courseTerms = [
  {
    id: "2025-t1",
    year: "2025–26",
    term: "Term 1",
    courses: [
      { code: "BIO1008", title: "Chemistry and Life Sciences", institution: null, instructor: null, description: null, notesUrl: null },
      { code: "CSC1003", title: "Introduction to Computer Science and Java Programming", institution: null, instructor: null, description: null, notesUrl: null },
      { code: "DAI1000", title: "Digital and AI Literacy", institution: null, instructor: null, description: null, notesUrl: null },
      { code: "ENG1001", title: "English Bridge Program (EBP)", institution: null, instructor: null, description: null, notesUrl: null },
      { code: "GEW1001", title: "Ethics and the Rule of Law", institution: null, instructor: null, description: null, notesUrl: null },
      { code: "MAT1001", title: "Calculus I", institution: null, instructor: null, description: null, notesUrl: null },
      { code: "PED1122", title: "Wushu Sanda", institution: null, instructor: null, description: null, notesUrl: null },
    ],
  },
  {
    id: "2025-t2", year: "2025–26", term: "Term 2",
    courses: [
      { code: "CHI1000", title: "Chinese", institution: null, instructor: null, description: null, notesUrl: null },
      { code: "CSC1004", title: "Computational Laboratory Using Java", institution: null, instructor: null, description: null, notesUrl: null },
      { code: "DDA2001", title: "Introduction to Data Science", institution: null, instructor: null, description: null, notesUrl: null },
      { code: "ENG1002", title: "English for Academic Purposes I", institution: null, instructor: null, description: null, notesUrl: null },
      { code: "GEW2001", title: "Introduction to Marxism", institution: null, instructor: null, description: null, notesUrl: null },
      { code: "MAT1002", title: "Calculus II", institution: null, instructor: null, description: null, notesUrl: null },
      { code: "MAT2041", title: "Linear Algebra and Applications", institution: null, instructor: null, description: null, notesUrl: null },
      { code: "PED1205", title: "Frisbee", institution: null, instructor: null, description: null, notesUrl: null },
    ],
  },
  {
    id: "2025-summer", year: "2025–26", term: "Summer",
    courses: [
      { code: "COMM3131", title: "Special Topic in Communication Studies I", institution: null, instructor: null, description: null, notesUrl: null },
      { code: "ENGG1910", title: "Demystifying Artificial Intelligence", institution: null, instructor: null, description: null, notesUrl: null },
    ],
  },
  {
    id: "2026-t1", year: "2026–27", term: "Term 1",
    courses: [
      { code: "CSC3001", title: "Discrete Mathematics", institution: null, instructor: null, description: null, notesUrl: null },
      { code: "CSC3200", title: "Data Structures and Advanced Programming", institution: null, instructor: null, description: null, notesUrl: null },
      { code: "GFN1000", title: "In Dialogue with Nature", institution: null, instructor: null, description: null, notesUrl: null },
      { code: "PHY1001", title: "Mechanics", institution: null, instructor: null, description: null, notesUrl: null },
      { code: "STA2001", title: "Probability and Statistics I", institution: null, instructor: null, description: null, notesUrl: null },
    ],
  },
];

export function findCourse(code) {
  return courseTerms.flatMap((term) => term.courses).find((course) => course.code === code);
}
```

- [ ] **Step 4: Run the data test**

Run: `node --test lib/courses.test.js`

Expected: 2 passing tests.

- [ ] **Step 5: Commit the data model**

```bash
git add lib/courses.js lib/courses.test.js
git commit -m "feat: add coursework roster"
```

### Task 2: Academic Copy and Navigation Labels

**Files:**
- Modify: `lib/translations.js`
- Modify: `components/Navbar.jsx`
- Modify: `components/Sidebar.jsx`

- [ ] **Step 1: Extend translations for the new interface**

```js
academic: {
  label: "Academic",
  title: "Learning, research, and making.",
  summary: "A record of courses, research, and writing shaped by study.",
  courses: "Courses",
  coursesSummary: "Courses I chose or am currently studying.",
  work: "Academic Work",
  workSummary: "Technology research and literary essays.",
  coursework: "Coursework",
  courseArchive: "A personal record of courses in progress and completed study.",
  toBeAdded: "To be added",
  institution: "Institution",
  instructor: "Instructor",
  description: "Description",
  notes: "GitHub Notes",
}
```

Add a parallel Chinese `academic` object: `学术`, `课程学习`, `我选择或正在学习的课程`, `学术创作`, `待补充`, and the matching field labels.

- [ ] **Step 2: Update the two navigation maps**

Replace the `writing` display key with `academic.label`, while retaining `anchor: "writing"` in the full page sidebar because the home section order is unchanged.

```js
["writing", "academic.label"]
```

- [ ] **Step 3: Verify localized navigation manually**

Run: `pnpm dev`

Expected: menu and sidebar display “Academic” in English and “学术” in Chinese; clicking the menu continues to scroll to section 03.

- [ ] **Step 4: Commit translations and labels**

```bash
git add lib/translations.js components/Navbar.jsx components/Sidebar.jsx
git commit -m "feat: label navigation as academic"
```

### Task 3: Shared Academic Entry Cards and Homepage Section

**Files:**
- Create: `components/AcademicCards.jsx`
- Modify: `app/(root)/page.jsx`

- [ ] **Step 1: Create the reusable entry card component**

```jsx
"use client";
import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";

export default function AcademicCards() {
  const { t } = useLocale();
  const cards = [
    { number: "01", href: "/academic/courses", label: "academic.courses", summary: "academic.coursesSummary" },
    { number: "02", href: "/academic/work", label: "academic.work", summary: "academic.workSummary" },
  ];
  return <div className="grid gap-px border border-ink/20 bg-ink/20 md:grid-cols-2">{
    cards.map((card) => <Link key={card.href} href={card.href} className="group flex min-h-72 flex-col justify-between bg-cream p-7 transition-colors hover:bg-[#f0ece3]">
      <p className="font-mono text-[10px] uppercase tracking-[.2em] text-muted">{card.number}</p>
      <div><h2 className="font-serif text-4xl text-ink">{t(card.label)}</h2><p className="mt-4 text-sm leading-6 text-muted">{t(card.summary)}</p></div>
    </Link>)
  }</div>;
}
```

Each mapped card uses the existing bordered, warm paper card style with a mono label, serif title, and summary. Do not duplicate Technology and Literature cards on the homepage.

- [ ] **Step 2: Replace homepage Section 03**

Replace the existing `writing.*` section copy with `academic.*`; use `<AcademicCards />`; set the quiet link to `/academic`. Preserve the section number `03` and the existing full page anchor order.

- [ ] **Step 3: Check desktop and mobile presentation**

Run: `pnpm dev`

Expected: desktop shows two equal cards; mobile stacks the same cards without title overlap.

- [ ] **Step 4: Commit homepage work**

```bash
git add components/AcademicCards.jsx 'app/(root)/page.jsx'
git commit -m "feat: add academic homepage section"
```

### Task 4: Academic Landing and Work Index

**Files:**
- Create: `app/academic/page.jsx`
- Create: `app/academic/courses/page.jsx`
- Create: `app/academic/work/page.jsx`

- [ ] **Step 1: Add the academic landing page**

```jsx
import AcademicCards from "@/components/AcademicCards";
import { LocalizedText } from "@/components/LocalizedText";

export default function AcademicPage() {
  return <main className="min-h-screen px-10 pb-24 pt-32"><div className="mx-auto max-w-screen-md">
    <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted"><LocalizedText id="academic.label" /></p>
    <h1 className="mt-6 font-serif text-5xl leading-[1.08] text-ink md:text-7xl"><LocalizedText id="academic.title" /></h1>
    <p className="mt-8 max-w-xl text-xl leading-relaxed text-muted"><LocalizedText id="academic.summary" /></p>
    <div className="mt-16"><AcademicCards /></div>
  </div></main>;
}
```

- [ ] **Step 2: Add the Academic Work index**

Create two cards linking to `/writing/technology` and `/writing/literature`, using `academic.work`, `writing.technology`, and `writing.literature` translation keys. This leaves article content and its URL intact.

- [ ] **Step 3: Add course page shell**

Render a dark archive section headed by `academic.coursework`, with `<CourseArchive terms={courseTerms} />` below the localized summary.

- [ ] **Step 4: Verify route navigation**

Run: `pnpm dev`

Expected: `/academic`, `/academic/work`, and `/academic/courses` each return 200 and all links navigate correctly.

- [ ] **Step 5: Commit the new routes**

```bash
git add app/academic
git commit -m "feat: add academic section routes"
```

### Task 5: Filterable, Expandable Course Archive

**Files:**
- Create: `components/CourseArchive.jsx`

- [ ] **Step 1: Implement one selected term and one expanded course state**

```jsx
"use client";
import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";

export default function CourseArchive({ terms }) {
  const [selectedTermId, setSelectedTermId] = useState(terms[0].id);
  const [openCode, setOpenCode] = useState(null);
  const selectedTerm = terms.find((term) => term.id === selectedTermId);
  const { t } = useLocale();
  // Render term buttons and mapped course rows.
}
```

- [ ] **Step 2: Render compact course rows**

Each row is a `<button>` with `aria-expanded={openCode === course.code}`. Render code, title, selected term, and a plus/minus marker. Use a dashed top divider and preserve the row’s code/title/term at all widths.

- [ ] **Step 3: Render metadata panel without invented values**

```jsx
const valueOrPending = (value) => value ?? t("academic.toBeAdded");

<dl className="grid gap-x-6 gap-y-3 border-t border-dashed border-offwhite/25 bg-offwhite/5 p-6 md:grid-cols-[8rem_1fr]">
  <dt>{t("academic.institution")}</dt><dd>{valueOrPending(course.institution)}</dd>
  <dt>{t("academic.instructor")}</dt><dd>{valueOrPending(course.instructor)}</dd>
  <dt>{t("academic.description")}</dt><dd>{valueOrPending(course.description)}</dd>
</dl>
```

Only render the GitHub notes anchor when `course.notesUrl` exists. Otherwise render the translated pending text in its place.

- [ ] **Step 4: Verify accessible interaction**

Run: `pnpm dev`

Expected: choosing a term changes the visible roster; selecting a row updates `aria-expanded`, shows the metadata panel, and selecting the same row closes it.

- [ ] **Step 5: Commit course interaction**

```bash
git add components/CourseArchive.jsx app/academic/courses/page.jsx
git commit -m "feat: add expandable course archive"
```

### Task 6: Legacy Writing Compatibility

**Files:**
- Modify: `app/writing/page.jsx`
- Modify: `app/writing/technology/page.jsx`
- Modify: `app/writing/literature/page.jsx`

- [ ] **Step 1: Redirect the legacy index**

```jsx
import { redirect } from "next/navigation";

export default function LegacyWritingIndex() {
  redirect("/academic/work");
}
```

- [ ] **Step 2: Update return links in collection pages**

Replace `href="/writing"` with `href="/academic/work"` and replace the return label with `academic.work`.

- [ ] **Step 3: Verify compatibility**

Run: `pnpm dev`

Expected: `/writing` redirects to `/academic/work`; `/writing/technology` and `/writing/literature` retain their present content and return to Academic Work.

- [ ] **Step 4: Commit compatibility changes**

```bash
git add app/writing/page.jsx app/writing/technology/page.jsx app/writing/literature/page.jsx
git commit -m "feat: route writing through academic work"
```

### Task 7: Production Verification

**Files:**
- No source modifications expected.

- [ ] **Step 1: Run course data tests**

Run: `node --test lib/courses.test.js`

Expected: 2 passing tests.

- [ ] **Step 2: Run the full production build**

Run: `pnpm build`

Expected: build exits 0 and lists `/academic`, `/academic/courses`, and `/academic/work` among generated routes.

- [ ] **Step 3: Check diff whitespace**

Run: `git diff --check HEAD~6..HEAD`

Expected: no output.

- [ ] **Step 4: Perform final browser checks**

Check English and Chinese views of `/`, `/academic`, `/academic/courses`, `/academic/work`, and legacy `/writing`. Verify a mobile width shows no horizontal overflow.

- [ ] **Step 5: Record verification results**

Report the passing data tests, production build result, and checked browser routes in the implementation summary. Do not create an additional commit when no source changes are required.
