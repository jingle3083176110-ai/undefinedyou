import { notFound } from "next/navigation";
import Link from "next/link";
import milestones from "@/json/milestones.json";
import ThoughtsOnVibeCoding from "@/content/writing/thoughts-on-vibe-coding.mdx";
import ANoteOnSolitude from "@/content/writing/a-note-on-solitude.mdx";
import NotesFromProfessorLee from "@/content/writing/notes-from-a-conversation-with-professor-lee.mdx";
import LocalizedText from "@/components/LocalizedText";

const contentBySlug = {
  "thoughts-on-vibe-coding": ThoughtsOnVibeCoding,
  "a-note-on-solitude": ANoteOnSolitude,
  "notes-from-a-conversation-with-professor-lee": NotesFromProfessorLee,
};

export function generateStaticParams() {
  return milestones.entries.map((entry) => ({ slug: entry.slug }));
}

export default async function MilestoneEntryPage({ params }) {
  const { slug } = await params;
  const entry = milestones.entries.find((item) => item.slug === slug);
  const Content = contentBySlug[slug];
  if (!entry || !Content) notFound();
  return <main className="min-h-screen px-6 pb-28 pt-28 md:px-10 md:pt-36"><article className="mx-auto max-w-[46rem]">
    <Link href="/journal/milestones" className="font-mono text-xs uppercase tracking-[0.3em] text-muted transition-colors hover:text-ink">← <LocalizedText id="journal.milestones" /></Link>
    <header className="mt-12 mb-4"><p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">Record / {entry.category}</p><h1 className="article-title mt-5 text-ink text-5xl leading-[1.08] tracking-normal md:text-7xl">{entry.title}</h1><div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted"><span>{entry.date}</span><span>{entry.category}</span><span>{entry.readingTime}</span></div><p className="article-lede mt-10 max-w-2xl text-muted">{entry.description}</p></header>
    <div className="article-copy mt-10 border-t border-ink/15 pt-2"><Content /></div>
  </article></main>;
}
