"use client";

import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
export default function WritingPage() {
	const { t } = useLocale();
	const collections = [
		{ slug: "technology", number: "01", title: t("writing.technology"), description: t("writing.technologySummary") },
		{ slug: "literature", number: "02", title: t("writing.literature"), description: t("writing.literatureSummary") },
	];
	return (
		<main className="min-h-screen px-10 pt-32 pb-24">
			<div className="mx-auto max-w-screen-md">
				<p className="font-mono text-xs tracking-[0.3em] uppercase text-muted mb-6">
					{t("writing.label")}
				</p>
				<h1 className="font-serif text-ink text-5xl md:text-7xl leading-[1.15]">
					{t("writing.title")}
				</h1>
				<p className="text-xl mt-8 text-muted leading-relaxed">
					{t("writing.summary")}
				</p>

				<div className="mt-16 grid gap-px border border-ink/15 bg-ink/15 md:grid-cols-2">
					{collections.map((collection) => (
						<Link
							key={collection.slug}
							href={`/writing/${collection.slug}`}
							className="group flex min-h-80 flex-col justify-between bg-warmwhite p-8 transition-colors hover:bg-[#f1ede5]">
							<span className="font-mono text-xs tracking-[0.25em] text-muted">{collection.number}</span>
							<div><h2 className="font-serif text-4xl leading-[1.08] tracking-normal text-ink transition-transform duration-300 group-hover:translate-x-2">{collection.title}</h2><p className="mt-5 max-w-sm leading-relaxed text-muted">{collection.description}</p><span className="mt-10 inline-block border-b border-ink pb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink">{t("writing.open")} ↗</span></div>
						</Link>
					))}
				</div>
			</div>
		</main>
	);
}
