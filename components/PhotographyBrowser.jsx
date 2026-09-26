"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { photosFor } from "@/lib/photos";

const transition = { duration: 0.36, ease: [0.22, 1, 0.36, 1] };

function formatDate(value, locale, fallback) {
  if (!value) return fallback;
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", { year: "numeric", month: "short", day: "numeric" }).format(new Date(`${value}T12:00:00`));
}

function PhotoMeta({ photo, locale, t }) {
  const location = locale === "zh" ? photo.locationZh : photo.location;
  const note = locale === "zh" ? photo.noteZh : photo.note;
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/45 to-transparent px-5 pb-5 pt-14 text-offwhite opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none">
      <p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#e7c98a]">{formatDate(photo.date, locale, t("photography.noDate"))}</p>
      <p className="mt-1 text-sm">{location || t("photography.noLocation")}{note ? ` · ${note}` : ""}</p>
    </div>
  );
}

function PhotoTile({ photo, index, onOpen, locale, t }) {
  return (
    <motion.button layout type="button" onClick={() => onOpen(index)} className="group relative mb-5 block w-full overflow-hidden rounded-sm bg-[#e6dfd4] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent motion-reduce:transform-none" transition={transition}>
      <img src={photo.src} alt={photo.alt} className="block h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transition-none" />
      <PhotoMeta photo={photo} locale={locale} t={t} />
    </motion.button>
  );
}

function CollectionCard({ collection, kind, photos, locale, t }) {
  const title = locale === "zh" ? collection.titleZh : collection.title;
  const intro = locale === "zh" ? collection.introZh : collection.intro;
  const location = locale === "zh" ? collection.locationZh : collection.location;
  const cover = photos.find((photo) => photo.id === collection.coverId) || photos[0];
  const isWorkshop = kind === "workshops";
  return (
    <motion.div layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }} transition={transition} className={isWorkshop ? "grid overflow-hidden rounded-sm border border-ink/15 bg-warmwhite md:grid-cols-[minmax(240px,42%)_1fr]" : "overflow-hidden rounded-sm border border-ink/15 bg-warmwhite"}>
      {isWorkshop ? (cover && <div className="bg-ink/5"><img src={cover.src} alt={cover.alt} className="h-full min-h-56 w-full object-cover md:min-h-72" /></div>) : <div className={`grid ${photos.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-px bg-ink/10`}>{photos.slice(0, 3).map((photo, index) => <img key={photo.id} src={photo.src} alt={photo.alt} className={`${photos.length === 1 ? "aspect-[16/9]" : index === 2 ? "col-span-2 aspect-[2/1]" : "aspect-[4/3]"} h-full w-full object-cover`} />)}</div>}
      <div className={isWorkshop ? "flex flex-col justify-center p-6 md:p-10" : "p-6 md:p-8"}><p className="font-mono text-xs uppercase tracking-[.22em] text-muted">{isWorkshop ? t("photography.workshops") : t("photography.themes")}</p><h2 className="mt-4 font-serif text-3xl leading-tight text-ink md:text-5xl">{title}</h2><p className="mt-4 max-w-xl text-base leading-7 text-muted">{intro}</p><p className="mt-5 font-mono text-xs uppercase tracking-[.16em] text-muted">{collection.dateRange ? formatDate(collection.dateRange, locale, "") : ""}{collection.dateRange && location ? " · " : ""}{location || ""}</p><Link href={`/journal/photography/${kind}/${collection.slug}`} className="mt-8 inline-flex self-start border-b border-ink/50 pb-2 font-mono text-xs uppercase tracking-[.2em] text-ink transition-colors hover:text-accent">{t("photography.viewCollection")} ↗</Link></div>
    </motion.div>
  );
}

export default function PhotographyBrowser({ photos, themes, workshops }) {
  const { locale, t } = useLocale();
  const [mode, setMode] = useState("gallery");
  const [galleryView, setGalleryView] = useState("masonry");
  const [activeIndex, setActiveIndex] = useState(null);
  const activePhoto = activeIndex === null ? null : photos[activeIndex];
  const collections = useMemo(() => (mode === "themes" ? themes : workshops), [mode, themes, workshops]);

  useEffect(() => {
    if (!activePhoto) return undefined;
    const handleKey = (event) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") setActiveIndex((index) => (index + 1) % photos.length);
      if (event.key === "ArrowLeft") setActiveIndex((index) => (index - 1 + photos.length) % photos.length);
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [activePhoto, photos.length]);

  return (
    <main className="min-h-screen bg-cream px-6 pb-24 pt-32 md:px-16 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs uppercase tracking-[.3em] text-muted">05 / {t("photography.label")}</p>
        <div className="mt-8 flex flex-col justify-between gap-8 border-b border-ink/15 pb-8 md:flex-row md:items-end"><div><h1 className="max-w-4xl font-serif text-5xl leading-[1.03] text-ink md:text-8xl">{t("photography.title")}</h1><p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">{t("photography.summary")}</p></div><div className="flex flex-wrap items-center gap-3"><div className="flex shrink-0 rounded-full border border-ink/25 p-1" role="group" aria-label={t("photography.label")}>{[["gallery", "photography.gallery"], ["themes", "photography.themes"], ["workshops", "photography.workshops"]].map(([value, label]) => <button key={value} type="button" aria-pressed={mode === value} onClick={() => setMode(value)} className={`rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[.15em] transition-colors motion-reduce:transition-none ${mode === value ? "bg-ink text-cream" : "text-muted hover:text-ink"}`}>{t(label)}</button>)}</div>{mode === "gallery" && <div className="flex shrink-0 rounded-full border border-ink/15 p-1" role="group" aria-label={t("photography.viewMode")}><button type="button" aria-pressed={galleryView === "masonry"} onClick={() => setGalleryView("masonry")} className={`rounded-full px-3 py-2 font-mono text-[10px] uppercase tracking-[.12em] ${galleryView === "masonry" ? "bg-ink text-cream" : "text-muted hover:text-ink"}`}>{t("photography.masonry")}</button><button type="button" aria-pressed={galleryView === "year"} onClick={() => setGalleryView("year")} className={`rounded-full px-3 py-2 font-mono text-[10px] uppercase tracking-[.12em] ${galleryView === "year" ? "bg-ink text-cream" : "text-muted hover:text-ink"}`}>{t("photography.byYear")}</button></div>}</div></div>
        <LayoutGroup>
          <AnimatePresence mode="popLayout" initial={false}>
            {mode === "gallery" ? (galleryView === "masonry" ? <motion.div key="gallery-masonry" layout className="columns-1 gap-5 pt-10 md:columns-2 lg:columns-3">{photos.map((photo, index) => <PhotoTile key={photo.id} photo={photo} index={index} onOpen={setActiveIndex} locale={locale} t={t} />)}</motion.div> : <motion.div key="gallery-year" layout className="space-y-14 pt-10">{Object.entries(photos.reduce((groups, photo) => { const year = photo.date ? photo.date.slice(0, 4) : t("photography.undated"); (groups[year] ||= []).push(photo); return groups; }, {})).map(([year, yearPhotos]) => <section key={year}><div className="mb-6 flex items-center gap-5"><h2 className="font-serif text-3xl text-ink md:text-4xl">{year}</h2><div className="h-px flex-1 bg-ink/15" /></div><div className="columns-1 gap-5 md:columns-2 lg:columns-3">{yearPhotos.map((photo) => <PhotoTile key={photo.id} photo={photo} index={photos.indexOf(photo)} onOpen={setActiveIndex} locale={locale} t={t} />)}</div></section>)}</motion.div>) : <motion.div key={mode} layout className="grid gap-8 pt-10">{collections.map((collection) => <CollectionCard key={collection.slug} collection={collection} kind={mode} photos={photosFor(collection.imageIds)} locale={locale} t={t} />)}</motion.div>}
          </AnimatePresence>
        </LayoutGroup>
      </div>
      <AnimatePresence>{activePhoto && <motion.div role="dialog" aria-modal="true" aria-label={t("photography.close")} className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/95 p-6 md:p-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition}><button type="button" aria-label={t("photography.close")} onClick={() => setActiveIndex(null)} className="absolute right-6 top-6 text-3xl text-offwhite transition-colors hover:text-[#e7c98a]">×</button><img src={activePhoto.src} alt={activePhoto.alt} className="max-h-[82vh] max-w-full object-contain" /><div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4 text-offwhite md:bottom-10 md:left-10 md:right-10"><div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#e7c98a]">{formatDate(activePhoto.date, locale, t("photography.noDate"))}</p><p className="mt-1 text-sm">{(locale === "zh" ? activePhoto.locationZh : activePhoto.location) || t("photography.noLocation")}</p></div><div className="flex gap-2"><button type="button" aria-label={t("photography.previous")} onClick={() => setActiveIndex((activeIndex - 1 + photos.length) % photos.length)} className="h-10 w-10 rounded-full border border-offwhite/40 text-lg hover:border-[#e7c98a]">←</button><button type="button" aria-label={t("photography.next")} onClick={() => setActiveIndex((activeIndex + 1) % photos.length)} className="h-10 w-10 rounded-full border border-offwhite/40 text-lg hover:border-[#e7c98a]">→</button></div></div></motion.div>}</AnimatePresence>
    </main>
  );
}
