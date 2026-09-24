"use client";

import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";

export default function TechnologyWritingPage() {
  const { t } = useLocale();
  return <main className="min-h-screen bg-warmwhite px-6 pb-28 pt-32 md:px-16 lg:px-24"><div className="mx-auto max-w-4xl"><Link href="/writing" className="font-mono text-xs uppercase tracking-[0.24em] text-muted">← {t("writing.back")}</Link><header className="mt-14 border-b border-ink/15 pb-12"><p className="font-mono text-xs uppercase tracking-[0.28em] text-accent">01 / {t("writing.technology")}</p><h1 className="mt-7 font-serif text-5xl leading-[1.04] tracking-normal text-ink md:text-8xl">{t("writing.research")}</h1><p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">{t("writing.researchSummary")}</p></header><p className="mt-20 border-l-2 border-accent pl-5 font-serif text-2xl leading-relaxed text-muted">{t("writing.comingSoon")}</p></div></main>;
}
