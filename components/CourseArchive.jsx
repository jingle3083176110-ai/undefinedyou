"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";

function valueOrPending(value, pending) {
  return value || pending;
}

export default function CourseArchive({ terms }) {
  const { locale, t } = useLocale();
  const [selectedTermId, setSelectedTermId] = useState(terms[0]?.id);
  const [openCourse, setOpenCourse] = useState(null);
  const selectedTerm = terms.find((term) => term.id === selectedTermId) ?? terms[0];

  const selectTerm = (id) => {
    setSelectedTermId(id);
    setOpenCourse(null);
  };

  return (
    <section className="mt-14 overflow-hidden rounded-3xl border border-ink/15 bg-ink text-offwhite shadow-[0_20px_50px_rgba(26,24,21,.12)]">
      <div className="border-b border-offwhite/20 px-6 py-7 md:px-10">
        <p className="font-mono text-xs uppercase tracking-[.26em] text-softgray">{t("academic.coursework")}</p>
        <div className="mt-7 flex flex-wrap gap-2" role="tablist" aria-label={t("academic.chooseTerm")}>
          {terms.map((term) => {
            const active = term.id === selectedTerm.id;
            const label = `${term.year} · ${locale === "zh" ? term.termZh : term.term}`;
            return <button key={term.id} type="button" role="tab" aria-selected={active} onClick={() => selectTerm(term.id)} className={`rounded-full border px-4 py-2.5 font-mono text-xs uppercase tracking-[.16em] transition-colors ${active ? "border-offwhite bg-offwhite text-ink" : "border-offwhite/25 text-softgray hover:border-offwhite/60 hover:text-offwhite"}`}>{label}</button>;
          })}
        </div>
      </div>

      <div className="px-6 py-2 md:px-10">
        {selectedTerm.courses.map((course) => {
          const id = `${selectedTerm.id}-${course.code}`;
          const isOpen = openCourse === id;
          return (
            <div key={course.code} className="border-b border-offwhite/15 last:border-b-0">
              <button type="button" onClick={() => setOpenCourse(isOpen ? null : id)} aria-expanded={isOpen} className="grid w-full grid-cols-[minmax(6rem,.65fr)_minmax(0,2.5fr)_auto] items-center gap-4 py-6 text-left transition-colors hover:text-[#e7c98a] md:gap-8">
                <span className="font-mono text-sm tracking-[.12em] text-softgray md:text-base">{course.code}</span>
                <span className="font-serif text-xl leading-tight md:text-2xl">{course.title}</span>
                <span className={`text-xl transition-transform ${isOpen ? "rotate-45" : ""}`} aria-hidden="true">+</span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: "easeOut" }} className="overflow-hidden">
                    <div className="grid gap-8 border-t border-offwhite/15 pb-9 pt-8 text-[1.05rem] leading-7 text-offwhite/80 md:grid-cols-[minmax(0,.8fr)_minmax(0,1.5fr)] md:gap-x-14 md:leading-8">
                      <dl className="space-y-6">
                        <div><dt className="font-mono text-sm uppercase tracking-[.2em] text-[#f0cf8c]">{t("academic.institution")}</dt><dd className="mt-1.5">{valueOrPending(course.institution, t("academic.toBeAdded"))}</dd></div>
                        <div><dt className="font-mono text-sm uppercase tracking-[.2em] text-[#f0cf8c]">{t("academic.instructor")}</dt><dd className="mt-1.5">{valueOrPending(course.instructor, t("academic.toBeAdded"))}</dd></div>
                      </dl>
                      <dl className="space-y-4">
                        <div><dt className="font-mono text-sm uppercase tracking-[.2em] text-[#f0cf8c]">{t("academic.description")}</dt><dd className="mt-1.5 max-w-3xl">{valueOrPending(course.description, t("academic.toBeAdded"))}</dd></div>
                        <div><dt className="font-mono text-sm uppercase tracking-[.2em] text-[#f0cf8c]">{t("academic.notes")}</dt><dd className="mt-1.5">{course.notesUrl ? <a className="border-b border-offwhite/60 text-offwhite transition-colors hover:text-[#f0cf8c]" href={course.notesUrl} target="_blank" rel="noreferrer">{t("academic.open")} ↗</a> : t("academic.notesPending")}</dd></div>
                      </dl>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
