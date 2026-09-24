export function useMDXComponents(components) {
	return {
		h1: (props) => (
			<h1
				className="font-serif text-4xl md:text-5xl leading-[1.05] tracking-[-0.035em] mt-14 mb-7"
				{...props}
			/>
		),
		h2: (props) => (
			<h2
				className="article-section-title border-t border-ink/15 pt-7 text-3xl md:text-4xl leading-tight tracking-[-0.03em] mt-16 mb-6 text-ink"
				{...props}
			/>
		),
		h3: (props) => (
			<h3 className="font-display text-lg md:text-xl font-medium leading-snug tracking-[-0.015em] mt-11 mb-3 text-ink" {...props} />
		),
		p: (props) => (
			<p className="article-body text-[1.12rem] md:text-[1.2rem] leading-[2] tracking-[0.005em] text-ink/80 my-8" {...props} />
		),
		a: (props) => (
			<a
				className="underline decoration-accent/60 underline-offset-4 hover:decoration-accent transition-colors"
				{...props}
			/>
		),
		blockquote: (props) => (
			<blockquote
				className="border-l border-accent pl-6 my-10 font-serif italic text-2xl leading-[1.45] text-ink/75"
				{...props}
			/>
		),
		code: (props) => (
			<code
				className="font-mono text-[0.85em] bg-ink/5 px-1.5 py-0.5 rounded"
				{...props}
			/>
		),
		pre: (props) => (
			<pre
				className="font-mono text-sm bg-nearblack text-offwhite p-6 rounded-md overflow-x-auto my-8 leading-relaxed [&_code]:bg-transparent [&_code]:p-0"
				{...props}
			/>
		),
		ul: (props) => (
			<ul className="article-body !list-disc pl-6 my-8 space-y-3 text-[1.12rem] md:text-[1.2rem] leading-9 text-ink/80" {...props} />
		),
		ol: (props) => (
			<ol
				className="article-body !list-decimal pl-6 my-8 space-y-3 text-[1.12rem] md:text-[1.2rem] leading-9 text-ink/80"
				{...props}
			/>
		),
		hr: () => <hr className="border-ink/15 my-12" />,
		img: (props) => (
			// eslint-disable-next-line @next/next/no-img-element
			<img className="rounded-md my-8 w-full" {...props} alt={props.alt || ""} />
		),
		...components,
	};
}
