"use client";

import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";

export default function PhotoCollectionPage({ collection, kind, photos }) {
  const { locale, t } = useLocale();
  const title = locale === "zh" ? collection.titleZh : collection.title;
  const intro = locale === "zh" ? collection.introZh : collection.intro;
  const location = locale === "zh" ? collection.locationZh : collection.location;
  return <main className="min-h-screen bg-cream px-6 pb-24 pt-32 md:px-16 lg:px-24"><div className="mx-auto max-w-7xl"><Link href="/journal/photography" className="font-mono text-xs uppercase tracking-[.24em] text-muted">← {t("photography.label")}</Link><header className="mt-14 max-w-4xl border-b border-ink/15 pb-10"><p className="font-mono text-xs uppercase tracking-[.28em] text-accent">{kind === "workshops" ? t("photography.workshops") : t("photography.themes")}</p><h1 className="mt-6 font-serif text-5xl leading-[1.04] text-ink md:text-8xl">{title}</h1><p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p><p className="mt-5 font-mono text-[10px] uppercase tracking-[.18em] text-muted">{collection.dateRange || ""}{collection.dateRange && location ? " · " : ""}{location || ""}</p></header><div className="mt-12 grid gap-6 md:grid-cols-2">{photos.map((photo) => <figure key={photo.id} className="group overflow-hidden"><img src={photo.src} alt={photo.alt} className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.015] motion-reduce:transition-none" /><figcaption className="mt-3 flex gap-3 font-mono text-[10px] uppercase tracking-[.15em] text-muted"><span>{photo.date || t("photography.noDate")}</span>{(locale === "zh" ? photo.locationZh : photo.location) && <span>· {locale === "zh" ? photo.locationZh : photo.location}</span>}</figcaption></figure>)}</div></div></main>;
}
