import CourseArchive from "@/components/CourseArchive";
import LocalizedText from "@/components/LocalizedText";
import { courseTerms } from "@/lib/courses";

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-warmwhite px-6 pb-24 pt-32 md:px-16 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted"><LocalizedText id="academic.coursework" /></p>
        <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[1.04] tracking-normal text-ink md:text-8xl"><LocalizedText id="academic.coursesTitle" /></h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted"><LocalizedText id="academic.courseArchive" /></p>
        <CourseArchive terms={courseTerms} />
      </div>
    </main>
  );
}
