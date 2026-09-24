import JournalCards from "@/components/JournalCards";
import LocalizedText from "@/components/LocalizedText";

export default function JournalPage() {
  return (
    <main className="min-h-screen bg-warmwhite px-6 pb-24 pt-32 md:px-16 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted">
          04 / <LocalizedText id="journal.label" />
        </p>
        <div className="mt-10 grid gap-10 md:grid-cols-[1.25fr_0.75fr] md:items-end">
          <h1 className="font-display text-[clamp(3.75rem,8vw,7.5rem)] font-medium leading-[1.02] tracking-normal">
            <LocalizedText id="journal.title" />
          </h1>
          <p className="max-w-md font-sans text-lg leading-relaxed text-muted md:mb-2">
            <LocalizedText id="journal.summary" />
          </p>
        </div>
        <div className="mt-16">
          <JournalCards />
        </div>
      </div>
    </main>
  );
}
