import Link from "next/link";
export default function WritingPage() {
	const collections = [
		{ slug: "technology", number: "01", title: "Technology", description: "Research notes, technical essays, and questions about software, AI, and systems." },
		{ slug: "literature", number: "02", title: "Literature", description: "Close readings, literary essays, and long-form reflections on language and culture." },
	];
	return (
		<main className="min-h-screen px-10 pt-32 pb-24">
			<div className="mx-auto max-w-screen-md">
				<p className="font-mono text-xs tracking-[0.3em] uppercase text-muted mb-6">
					Studies & Essays
				</p>
				<h1 className="font-serif text-ink text-5xl md:text-7xl leading-[1.15]">
					Research, papers, and inquiry.
				</h1>
				<p className="text-xl mt-8 text-muted leading-relaxed">
					A home for professional writing: technical explorations, academic work, and literary study.
				</p>

				<div className="mt-16 grid gap-px border border-ink/15 bg-ink/15 md:grid-cols-2">
					{collections.map((collection) => (
						<Link
							key={collection.slug}
							href={`/writing/${collection.slug}`}
							className="group flex min-h-80 flex-col justify-between bg-warmwhite p-8 transition-colors hover:bg-[#f1ede5]">
							<span className="font-mono text-xs tracking-[0.25em] text-muted">{collection.number}</span>
							<div><h2 className="font-serif text-4xl leading-[1.08] tracking-normal text-ink transition-transform duration-300 group-hover:translate-x-2">{collection.title}</h2><p className="mt-5 max-w-sm leading-relaxed text-muted">{collection.description}</p><span className="mt-10 inline-block border-b border-ink pb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink">Open collection ↗</span></div>
						</Link>
					))}
				</div>
			</div>
		</main>
	);
}
