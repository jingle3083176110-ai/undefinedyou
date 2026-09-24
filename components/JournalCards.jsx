import Link from "next/link";

const sections = [
  {
    number: "01",
    title: "Milestones",
    label: "A living timeline",
    description:
      "Important moments, turning points, and the writing that helped make sense of them.",
    href: "/journal/milestones",
  },
  {
    number: "02",
    title: "Reading Room",
    label: "A personal shelf",
    description:
      "Books kept close, pages underlined, and notes written after the reading slows down.",
    href: "/journal/reading",
  },
  {
    number: "03",
    title: "Capital Journal",
    label: "A quiet ledger",
    description:
      "Reading notes, financial ideas, and the questions worth revisiting over time.",
    href: "/journal/money",
  },
];

export default function JournalCards() {
  return (
    <div className="grid gap-px border border-ink/15 bg-ink/15 md:grid-cols-3">
      {sections.map((section) => (
        <Link
          key={section.href}
          href={section.href}
          className="group flex min-h-72 flex-col justify-between bg-warmwhite p-7 transition-colors duration-300 hover:bg-[#eee8dd] md:min-h-80"
        >
          <div className="flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
            <span>{section.number}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
              ↗
            </span>
          </div>
          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              {section.label}
            </p>
            <h3 className="font-display text-4xl leading-none md:text-5xl">
              {section.title}
            </h3>
            <p className="mt-5 max-w-xs font-sans text-sm leading-relaxed text-muted">
              {section.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
