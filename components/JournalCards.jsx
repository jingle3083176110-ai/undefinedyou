"use client";

import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";

const sectionKeys = [
  {
    number: "01",
    title: "journal.milestones",
    label: "journal.milestonesLabel",
    description: "journal.milestonesSummary",
    href: "/journal/milestones",
  },
  {
    number: "02",
    title: "journal.reading",
    label: "journal.readingLabel",
    description: "journal.readingSummary",
    href: "/journal/reading",
  },
  {
    number: "03",
    title: "photography.cardTitle",
    label: "photography.label",
    description: "photography.summary",
    href: "/journal/photography",
  },
];

export default function JournalCards() {
	const { t } = useLocale();
  return (
    <div className="grid gap-px border border-ink/15 bg-ink/15 md:grid-cols-3">
      {sectionKeys.map((section) => (
        <Link
          key={section.href}
          href={section.href}
          className="group flex min-h-72 flex-col bg-warmwhite p-7 transition-colors duration-300 hover:bg-[#eee8dd] md:min-h-80"
        >
          <div className="flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
            <span>{section.number}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
              ↗
            </span>
          </div>
          <div className="mt-16">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              {t(section.label)}
            </p>
            <h3 className="font-display text-4xl leading-none md:text-5xl">
              {t(section.title)}
            </h3>
            <p className="mt-5 max-w-xs font-sans text-sm leading-relaxed text-muted">
              {t(section.description)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
