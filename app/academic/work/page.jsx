"use client";

import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";

export default function AcademicWorkPage() {
  const { t } = useLocale();
  const collections = [
    { href: "/writing/technology", number: "01", title: t("writing.technology"), description: t("writing.technologySummary") },
    { href: "/writing/literature", number: "02", title: t("writing.literature"), description: t("writing.literatureSummary") },
  ];
  return <main className="min-h-screen bg-cream px-6 pb-24 pt-32 md:px-16 lg:px-24"><div className="mx-auto max-w-6xl"><p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">{t("academic.work")}</p><h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[1.04] tracking-normal text-ink md:text-8xl">{t("academic.workTitle")}</h1><p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">{t("academic.workSummary")}</p><div className="mt-16 grid gap-px border border-ink/15 bg-ink/15 md:grid-cols-2">{collections.map((collection) => <Link key={collection.href} href={collection.href} className="group flex min-h-80 flex-col justify-between bg-warmwhite p-8 transition-colors hover:bg-[#f1ede5]"><span className="font-mono text-xs tracking-[0.25em] text-muted">{collection.number}</span><div><h2 className="font-serif text-4xl leading-[1.08] tracking-normal text-ink transition-transform duration-300 group-hover:translate-x-2">{collection.title}</h2><p className="mt-5 max-w-sm leading-relaxed text-muted">{collection.description}</p><span className="mt-10 inline-block border-b border-ink pb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink">{t("academic.open")} ↗</span></div></Link>)}</div></div></main>;
}
