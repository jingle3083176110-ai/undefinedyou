"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { FullPageWrapper, Section, useFullPage } from "@alvalens/react-fullpage-snap";
import projects from "@/json/data.json";
import JournalCards from "@/components/JournalCards";
import AcademicCards from "@/components/AcademicCards";
import ContactOrbit from "@/components/ContactOrbit";
import { useLocale } from "@/components/LocaleProvider";

const reveal = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } };

function SectionMark({ number, label, dark = false }) {
	return <p className={`font-mono text-xs uppercase tracking-[0.32em] ${dark ? "text-softgray" : "text-muted"}`}>{number} / {label}</p>;
}

function QuietLink({ href, children, dark = false }) {
	return <Link href={href} className={`inline-flex items-center gap-3 border-b pb-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-all hover:gap-5 ${dark ? "border-offwhite/40 text-offwhite" : "border-ink/40 text-ink"}`}>{children} <span aria-hidden="true">↗</span></Link>;
}

function ScrollIndicator() {
	const { activeIndex, moveTo } = useFullPage();
	const { t } = useLocale();
	return <AnimatePresence>{activeIndex === 0 && <motion.button aria-label={t("home.explore")} onClick={() => moveTo(1)} className="fixed bottom-7 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2 text-muted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 1 }}><span className="font-mono text-[10px] uppercase tracking-[0.3em]">{t("home.explore")}</span><span className="h-10 w-px bg-ink/45" /></motion.button>}</AnimatePresence>;
}

export default function HomePage() {
	const { t } = useLocale();
	const featuredProjects = projects.Projects.filter((project) => project.show && project.featured).slice(0, 2);

	return (
		<FullPageWrapper className="bg-cream">
			<Section><section className="relative flex min-h-screen w-full overflow-hidden bg-cream px-8 pb-24 pt-28 md:px-24"><div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(26,24,21,.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(26,24,21,.08)_1px,transparent_1px)] [background-size:72px_72px]" /><div className="relative mx-auto flex w-full max-w-7xl flex-col justify-between"><div className="flex items-center justify-between"><SectionMark number="00" label="Undefined" /><span className="font-mono text-xs tracking-[0.18em] text-muted">2026 — ∞</span></div><motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.13 }} className="max-w-5xl"><motion.p variants={reveal} className="mb-5 font-mono text-sm text-muted">const you = undefined;</motion.p><motion.h1 variants={reveal} className="font-serif text-[clamp(3.25rem,8vw,8rem)] leading-[1.02] tracking-normal text-ink">{t("home.heroTitle")}</motion.h1><motion.p variants={reveal} className="mt-10 max-w-2xl font-serif text-lg italic leading-relaxed text-muted md:text-2xl">{t("home.heroSubtitle")}</motion.p></motion.div><div className="flex items-end justify-between border-t border-ink/15 pt-5"><span className="font-mono text-xs uppercase tracking-[0.23em] text-muted">{t("home.motto")}</span><span className="hidden font-mono text-xs text-muted md:block">{t("home.scroll")}</span></div></div></section></Section>

			<Section><section className="flex min-h-screen w-full items-center bg-warmwhite px-8 py-24 md:px-24"><div className="mx-auto grid w-full max-w-7xl gap-12 md:grid-cols-[1.35fr_.65fr] md:gap-24"><div><SectionMark number="01" label={t("nav.about")} /><motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} className="mt-8 max-w-4xl font-serif text-5xl leading-[1.04] tracking-normal text-ink md:text-8xl">{t("home.aboutTitle")}</motion.h2><p className="mt-10 max-w-xl text-base leading-8 text-muted md:text-lg">{t("home.aboutSummary")}</p><div className="mt-10"><QuietLink href="/about">{t("home.moreAbout")}</QuietLink></div></div><aside className="self-end border-l border-ink/20 pl-6 md:pb-4"><p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">{t("home.currently")}</p><ul className="mt-5 space-y-3 font-serif text-2xl text-ink"><li>{t("about.computerScience")}</li><li>{t("about.backendSystems")}</li><li>{t("about.aiAgents")}</li></ul><p className="mt-12 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">{t("home.alongside")}</p><ul className="mt-5 space-y-3 text-sm text-muted"><li>{t("about.writing")}</li><li>{t("about.reading")}</li><li>{t("about.life")}</li><li>{t("about.exploring")}</li></ul></aside></div></section></Section>

			<Section><section className="relative flex min-h-screen w-full items-center overflow-hidden bg-charcoal px-8 py-24 text-offwhite md:px-24"><div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(236,231,221,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(236,231,221,.08)_1px,transparent_1px)] [background-size:42px_42px]" /><div className="relative mx-auto w-full max-w-7xl"><div className="flex items-end justify-between"><div><SectionMark number="02" label={t("nav.projects")} dark /><h2 className="mt-5 font-serif text-5xl tracking-normal md:text-7xl">{t("home.projectsTitle")}</h2></div><span className="hidden font-mono text-[10px] uppercase tracking-[.2em] text-softgray md:block">{t("home.selectedWork")} / 02</span></div><div className="mt-12 grid gap-px border border-offwhite/15 bg-offwhite/15 md:grid-cols-2">{featuredProjects.map((project, index) => <Link key={project.slug} href={`/projects/${project.slug}`} className="group min-h-64 bg-charcoal p-7 transition-colors hover:bg-[#25231c]"><p className="font-mono text-[10px] text-softgray">0{index + 1} — {project.year}</p><h3 className="mt-16 font-serif text-4xl tracking-normal">{project.title}</h3><p className="mt-4 max-w-md text-sm leading-6 text-softgray">{project.desc[0]}</p><div className="mt-7 flex flex-wrap gap-2">{project.tech.map((tech) => <span key={tech} className="border border-offwhite/20 px-2 py-1 font-mono text-[10px] text-softgray">{tech}</span>)}</div></Link>)}</div><div className="mt-9"><QuietLink href="/projects" dark>{t("home.allProjects")}</QuietLink></div></div></section></Section>

			<Section><section className="flex min-h-screen w-full items-center bg-cream px-8 py-24 md:px-24"><div className="mx-auto grid w-full max-w-7xl gap-12 md:grid-cols-[.72fr_1.28fr]"><div><SectionMark number="03" label={t("academic.label")} /><h2 className="mt-6 font-serif text-5xl leading-[1.04] tracking-normal text-ink md:text-7xl">{t("home.academicTitle")}</h2><p className="mt-7 max-w-sm leading-7 text-muted">{t("home.academicSummary")}</p><div className="mt-10"><QuietLink href="/academic">{t("home.exploreAcademic")}</QuietLink></div></div><AcademicCards /></div></section></Section>

			<Section>
				<section className="flex min-h-screen w-full items-center bg-warmwhite px-8 py-24 md:px-24">
					<div className="mx-auto w-full max-w-7xl">
						<SectionMark number="04" label={t("journal.label")} />
						<div className="mt-8 flex flex-col justify-between gap-10 md:flex-row md:items-end">
							<h2 className="max-w-3xl font-serif text-5xl leading-[1.04] tracking-normal text-ink md:text-8xl">{t("home.journalTitle")}</h2>
							<p className="max-w-xs leading-7 text-muted">{t("home.journalSummary")}</p>
						</div>
						<div className="mt-14"><JournalCards /></div>
						<div className="mt-10"><QuietLink href="/journal">{t("home.enterJournal")}</QuietLink></div>
					</div>
				</section>
			</Section>

			<Section><section className="flex min-h-screen w-full items-center bg-ink px-8 py-24 text-offwhite md:px-24"><div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-16"><SectionMark number="05" label={t("nav.contact")} dark /><div><h2 className="max-w-4xl font-serif text-6xl leading-[1.02] tracking-normal md:text-9xl">{t("home.contactTitle")}</h2><p className="mt-8 max-w-lg leading-7 text-softgray">{t("home.contactSummary")}</p><ContactOrbit /></div><div className="flex flex-wrap justify-between gap-6 border-t border-offwhite/20 pt-5 font-mono text-[10px] uppercase tracking-[.18em] text-softgray"><span>undefinedyou</span><span>{t("home.madeSlowly")}</span><span>© 2026</span></div></div></section></Section>
			<ScrollIndicator />
		</FullPageWrapper>
	);
}
