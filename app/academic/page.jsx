import AcademicCards from "@/components/AcademicCards";
import LocalizedText from "@/components/LocalizedText";

export default function AcademicPage() {
  return (
    <main className="min-h-screen bg-cream px-6 pb-24 pt-32 md:px-16 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted"><LocalizedText id="academic.label" /></p>
        <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[1.04] tracking-normal text-ink md:text-8xl"><LocalizedText id="academic.title" /></h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted"><LocalizedText id="academic.summary" /></p>
        <div className="mt-16"><AcademicCards /></div>
      </div>
    </main>
  );
}
