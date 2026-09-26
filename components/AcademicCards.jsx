"use client";

import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";

export default function AcademicCards() {
  const { t } = useLocale();
  const cards = [
    { href: "/academic/courses", number: "01", eyebrow: t("academic.coursework"), title: t("academic.courses"), description: t("academic.coursesSummary") },
    { href: "/academic/work", number: "02", eyebrow: t("academic.work"), title: t("academic.work"), description: t("academic.workSummary") },
  ];

  return (
    <div className="grid gap-px border border-ink/20 bg-ink/20 md:grid-cols-2">
      {cards.map((card) => (
        <Link key={card.href} href={card.href} className="group min-h-72 bg-cream p-7 transition-colors hover:bg-[#f0ece3]">
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-muted">{card.number} / {card.eyebrow}</p>
          <h3 className="mt-16 font-serif text-4xl tracking-normal text-ink transition-transform group-hover:translate-x-2">{card.title}</h3>
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted">{card.description}</p>
          <span className="mt-8 inline-block border-b border-ink/40 pb-1 font-mono text-[10px] uppercase tracking-[.2em] text-ink">{t("academic.open")} ↗</span>
        </Link>
      ))}
    </div>
  );
}
