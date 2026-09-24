# Bilingual Interface Design

## Goal

Add a bilingual English and Chinese interface to the website. English remains the default language. Long-form content stays in its original language.

## Scope

Translate interface labels and short presentation copy across navigation, home sections, About, Projects, Writing, Journal, Contact, page footers, calls to action, categories, and project/contact summaries.

Do not translate article bodies, reading notes, financial notes, academic-paper text or titles, PDF files, or technology lists.

## Interaction

Place a compact `EN | 中` segmented control in the right side of the global navigation. The active language receives a dark filled state. Switching changes interface copy in place and preserves the current route.

The selected language is stored in the browser. A new visitor, or a browser without storage support, sees English.

## Architecture

Use a client-side language provider with a small translation dictionary. Components consume the active locale through a shared hook. Existing content data remains unchanged where it represents original work; only UI labels and short summaries gain translations.

## Verification

Check desktop and mobile layouts, in-place language switching, menu active-state behavior, internal links, contact disclosure controls, the project page, and PDF download links. Confirm that long-form content remains unchanged in both interface languages.
