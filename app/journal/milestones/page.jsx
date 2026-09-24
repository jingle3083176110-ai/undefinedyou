import Link from "next/link";
import milestones from "@/json/milestones.json";
import LocalizedText from "@/components/LocalizedText";

const entries = [...milestones.entries].sort(
  (a, b) => new Date(b.date) - new Date(a.date),
);

export default function MilestonesPage() {
  return (
    <main className="min-h-screen bg-warmwhite px-6 pb-28 pt-32 md:px-16 lg:px-24">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/journal"
          className="font-mono text-xs uppercase tracking-[0.24em] text-muted transition-colors hover:text-ink"
        >
          ← <LocalizedText id="journal.back" />
        </Link>
        <header className="mt-12 border-b border-ink/15 pb-12">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted">
            01 / <LocalizedText id="journal.milestonesLabel" />
          </p>
          <h1 className="mt-7 font-display text-[clamp(3.5rem,8vw,7rem)] leading-[1.02] tracking-normal">
            <LocalizedText id="journal.milestones" />
          </h1>
          <p className="mt-8 max-w-xl font-sans text-lg leading-relaxed text-muted">
            <LocalizedText id="journal.timelineSummary" />
          </p>
        </header>

        <ol className="relative mt-16 border-l border-ink/20 pl-8 md:ml-24 md:pl-14">
          {entries.map((entry) => (
            <li key={entry.slug} className="relative pb-16 last:pb-0">
              <span className="absolute -left-[2.55rem] top-1 h-3 w-3 rounded-full border-2 border-warmwhite bg-ink md:-left-[3.8rem]" />
              <time className="font-mono text-xs tracking-[0.2em] text-muted">
                {entry.date}
              </time>
              <Link href={`/journal/milestones/${entry.slug}`} className="group mt-4 block max-w-2xl">
                <h2 className="font-display text-4xl leading-[1.05] tracking-normal transition-transform duration-300 group-hover:translate-x-2 md:text-5xl">
                  {entry.title}
                </h2>
                <p className="mt-4 font-sans leading-relaxed text-muted">
                  {entry.description}
                </p>
                <span className="mt-5 inline-block border-b border-ink pb-1 font-mono text-[10px] uppercase tracking-[0.2em]">
                  <LocalizedText id="journal.read" /> ↗
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
