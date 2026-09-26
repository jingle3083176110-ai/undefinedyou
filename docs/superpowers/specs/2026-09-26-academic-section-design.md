# Academic Section Design

## Purpose

Replace the current Writing area with an Academic section that records coursework and academic creative work. The section remains English first, with Chinese interface translations. Course titles and academic work retain their original language.

## Information Architecture

### Homepage

Section 03 becomes **Academic**. It has two equal cards:

1. **Courses** — “Courses I chose or am currently studying.” Links to `/academic/courses`.
2. **Academic Work** — Links to `/academic/work`, which contains the existing technology research and literature collections.

### Academic landing page

`/academic` repeats the two entry points as a focused index page.

### Coursework archive

`/academic/courses` groups the supplied course list into four terms:

- 2025–26 Term 1: BIO1008, CSC1003, DAI1000, ENG1001, GEW1001, MAT1001, PED1122.
- 2025–26 Term 2: CHI1000, CSC1004, DDA2001, ENG1002, GEW2001, MAT1002, MAT2041, PED1205.
- 2025–26 Summer: COMM3131, ENGG1910.
- 2026–27 Term 1: CSC3001, CSC3200, GFN1000, PHY1001, STA2001.

Terms act as filters. Each course appears as a horizontal expandable row with course code, official course title, and term. Opening a row reveals:

- Institution
- Instructor
- Course description
- GitHub notes link

The provided roster contains only course code and title. Missing metadata displays a translated “To be added” state. No institution, instructor, description, or repository URL is invented.

### Academic Work

`/academic/work` presents two cards:

- Technology Research → the existing technology page
- Literature → the existing literature page

The legacy `/writing` route redirects to `/academic/work`. Existing `/writing/technology` and `/writing/literature` links remain available and continue serving their current content.

## Visual Design

The section uses the current site’s warm paper palette, serif display typography, mono labels, thin rules, and bordered cards.

Coursework differs from the current writing cards through an editorial register: a term heading, dashed row dividers, muted course code, large course title, and a compact plus icon. The expanded detail panel has a quiet inset surface so the open course is clear without changing the page’s visual language.

The homepage and academic landing page use the approved balanced two card arrangement.

## Localization

- All interface labels are defined in the current translation module for English and Chinese.
- Course codes and official English titles remain unchanged in both languages.
- Existing paper, journal, reading, finance, and project content remains unchanged.

## Validation

- Verify the home Academic section and all new routes at desktop and mobile widths.
- Verify term filters and each course expansion.
- Verify legacy Writing routes resolve to the intended Academic locations.
- Run the production build and whitespace validation before local review.

## Scope Boundaries

This change does not add course metadata beyond the supplied roster. It does not alter the existing technology and literature article content. It does not deploy to GitHub or Vercel until the user accepts the local result.
