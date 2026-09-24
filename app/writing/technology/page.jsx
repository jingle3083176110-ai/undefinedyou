import Link from "next/link";

export default function TechnologyWritingPage() {
  return <main className="min-h-screen bg-warmwhite px-6 pb-28 pt-32 md:px-16 lg:px-24"><div className="mx-auto max-w-4xl"><Link href="/writing" className="font-mono text-xs uppercase tracking-[0.24em] text-muted">← Studies & Essays</Link><header className="mt-14 border-b border-ink/15 pb-12"><p className="font-mono text-xs uppercase tracking-[0.28em] text-accent">01 / Technology</p><h1 className="mt-7 font-serif text-5xl leading-[1.04] tracking-normal text-ink md:text-8xl">Technology<br />& research.</h1><p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">Technical essays, research notes, papers, and questions about AI, software, systems, and the work behind them.</p></header><p className="mt-20 border-l-2 border-accent pl-5 font-serif text-2xl leading-relaxed text-muted">The first pieces in this collection will appear here.</p></div></main>;
}
