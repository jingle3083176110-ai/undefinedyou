"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const fadeUp = (delay = 0) => ({
	initial: { opacity: 0, y: 30 },
	whileInView: { opacity: 1, y: 0 },
	transition: { duration: 0.6, delay },
});

function SectionTitle({ children }) {
	return (
		<h2 className="font-mono text-xs tracking-[0.3em] uppercase text-muted border-b border-ink/15 pb-3 mb-8">
			{children}
		</h2>
	);
}

export default function Page() {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<main className="overflow-hidden px-10 pt-32 pb-24">
			<div className="mx-auto max-w-screen-md">
				<motion.p
					className="font-mono text-xs tracking-[0.3em] uppercase text-muted mb-6"
					{...fadeUp()}>
					About
				</motion.p>
				<div className="grid items-center gap-12 md:grid-cols-[minmax(0,1fr)_13rem] md:gap-16">
					<div>
						<motion.h1
							className="font-serif text-ink text-4xl md:text-6xl leading-[1.2]"
							{...fadeUp(0.1)}>
							A student, a builder, and someone still figuring things out.
						</motion.h1>
						<motion.p
							className="text-xl mt-8 text-muted leading-relaxed"
							{...fadeUp(0.2)}>
							I use this space to leave a trace of projects, questions, and the small things that change how I see the world.
						</motion.p>
					</div>
					<motion.div className="md:justify-self-end" {...fadeUp(0.25)}>
					<img
						src="/about/profile.jpg"
						alt="Personal profile"
						className="h-52 w-52 rounded-full border border-ink/15 object-cover shadow-[0_12px_30px_rgba(26,24,21,.12)]"
					/>
					</motion.div>
				</div>

				<motion.div className="mt-20 grid gap-16 md:grid-cols-2" {...fadeUp(0.1)}>
					<div>
						<SectionTitle>Currently</SectionTitle>
						<ul className="space-y-2 font-serif text-2xl text-ink">
							<li>Computer Science</li>
							<li>Backend Systems</li>
							<li>AI Agents</li>
						</ul>
					</div>
					<div>
						<SectionTitle>Alongside</SectionTitle>
						<ul className="space-y-3 text-muted">
							<li>Writing</li>
							<li>Reading</li>
							<li>Life</li>
							<li>Exploring</li>
						</ul>
					</div>
				</motion.div>

				<motion.div className="mt-16" {...fadeUp()}>
					<SectionTitle>Education</SectionTitle>
					<p className="text-muted leading-relaxed">
						Undergraduate student in Computer Science and Engineering at The
						Chinese University of Hong Kong, Shenzhen (CUHK-Shenzhen).
					</p>
				</motion.div>
			</div>
		</main>
	);
}
