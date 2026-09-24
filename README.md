# undefinedyou

Personal portfolio website built with Next.js 15, featuring fullpage scrolling, Framer Motion animations, and Tailwind CSS.

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

## Features

- **Fullpage Scrolling** — Section-based navigation on the home page with sidebar active indicator
- **Smooth Page Transitions** — Fade + scale animation between routes via Framer Motion
- **Scroll Animations** — Staggered entrance animations on skills, experience, and project sections
- **Dynamic Project Data** — Projects loaded from a JSON file with category filtering and detail pages
- **Skeleton & Blur Loading** — Project images load with blur placeholder and skeleton overlay
- **Writing & Journal** — MDX-powered writing section and journal entries
- **SEO** — Per-page metadata, OpenGraph tags, and JSON-LD structured data
- **Responsive** — Scales smoothly across browser zoom levels (100%–150%)

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Scrolling:** @alvalens/react-fullpage-snap
- **Fonts:** Poppins, Jost, Newsreader, IBM Plex Mono (self-hosted via next/font)
- **MDX:** @next/mdx + @mdx-js/loader
- **Analytics:** Vercel Analytics

## Getting Started

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm start
```
