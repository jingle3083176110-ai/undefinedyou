import Link from "next/link";
import { getFinanceEntries } from "@/lib/finance";

function InlineText({ parts }) {
  return parts.map((part, index) => part.emphasis
    ? <strong key={index} className="font-medium text-[#e5c889]">{part.text}</strong>
    : <span key={index}>{part.text}</span>);
}

export default function MoneyNotesPage() {
  const entries = getFinanceEntries();
  return (
    <main className="min-h-screen bg-[#20211d] px-6 pb-28 pt-32 text-[#f2efe7] md:px-16 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <Link href="/journal" className="font-mono text-xs uppercase tracking-[0.24em] text-[#bdb9ac] transition-colors hover:text-white">← Journal</Link>
        <header className="mt-14 grid gap-10 border-b border-white/20 pb-14 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div><p className="font-mono text-xs uppercase tracking-[0.28em] text-[#bdb9ac]">03 / A quiet ledger</p><h1 className="mt-7 font-display text-[clamp(3.5rem,8vw,7rem)] leading-[1.02] tracking-normal">Capital Journal</h1></div>
          <p className="max-w-md font-serif text-xl leading-relaxed text-[#cfc9bd]">A private archive for financial reading, first principles, and ideas that need time before they become convictions.</p>
        </header>

        <nav className="mt-16 grid gap-px border border-white/20 bg-white/20 md:grid-cols-3">
          {entries.map((entry) => <a key={entry.slug} href={`#${entry.slug}`} className="group flex min-h-64 flex-col justify-between bg-[#20211d] p-7 transition-colors hover:bg-[#292a25]"><span className="font-mono text-xs tracking-[0.22em] text-[#bdb9ac]">{entry.number}</span><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#bdb9ac]">{entry.label}</p><h2 className="mt-3 font-display text-4xl leading-none transition-transform duration-300 group-hover:translate-x-1">{entry.title}</h2><p className="mt-5 font-sans leading-relaxed text-[#cfc9bd]">{entry.description}</p><p className="mt-10 font-mono text-[10px] uppercase tracking-[0.2em] text-[#d9bf8b]">Open notes ↓</p></div></a>)}
        </nav>

        <section className="mt-24 space-y-28">
          {entries.map((entry) => <article id={entry.slug} key={entry.slug} className="scroll-mt-12 border-t border-white/20 pt-10">
            <div className="grid gap-10 md:grid-cols-[11rem_minmax(0,1fr)]">
              <header className="md:sticky md:top-28 md:self-start"><p className="font-mono text-xs tracking-[0.22em] text-[#bdb9ac]">{entry.number} / {entry.label}</p><h2 className="mt-5 font-display text-5xl leading-none">{entry.title}</h2></header>
              <div className="max-w-3xl divide-y divide-white/15">
                {entry.sections.map((section) => <section key={section.heading} className="py-10 first:pt-0"><h3 className="font-serif text-3xl leading-tight text-[#f2efe7]">{section.heading}</h3><div className="mt-6 space-y-4 font-sans text-[1.02rem] leading-8 text-[#cfc9bd]">
                  {section.lines.map((line, index) => {
                    if (line.type === "subheading") return <h4 key={index} className="mt-8 border-l-2 border-[#c4a46e] pl-4 font-serif text-2xl leading-tight text-[#ede0c9]">{line.text}</h4>;
                    if (line.type === "definition") return <p key={index} className="grid gap-1 border-b border-white/10 pb-4 md:grid-cols-[9rem_1fr]"><span className="font-medium text-[#e5c889]">{line.term}</span><span><InlineText parts={line.parts} /></span></p>;
                    return <p key={index} className={line.type === "list" ? "border-l border-[#8f7a55] pl-4" : ""}><InlineText parts={line.parts} /></p>;
                  })}
                </div></section>)}
              </div>
            </div>
          </article>)}
        </section>
      </div>
    </main>
  );
}
