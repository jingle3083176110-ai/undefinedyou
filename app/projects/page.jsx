"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/Button";

import ProjectCard from "./components/ProjectCard";
import Projects from "@/json/data.json";

const category = {
	1: "Web Development",
	2: "AI & Machine Learning",
	9: "Other",
};

export default function Page() {
	const [activeCategory, setActiveCategory] = useState(9);
	const projects = Projects.Projects.filter((item) => item.show === true);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return (
		<>
			<main className="overflow-hidden bg-charcoal text-offwhite min-h-screen">
				<div className="relative w-screen min-h-[60vh] gap-4 p-10 pt-32 flex justify-center items-start flex-col overflow-hidden mx-auto max-w-screen-2xl">
					<motion.p
						className="font-mono text-xs tracking-[0.3em] uppercase text-softgray mb-6"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}>
						Projects
					</motion.p>
					<motion.h1
						className="font-serif text-5xl md:text-7xl leading-[1.15]"
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.1 }}>
						Things I build.
					</motion.h1>
					<motion.p
						className="text-lg mt-6 text-softgray max-w-2xl leading-relaxed"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}>
						Projects, experiments, and things I&apos;m learning through
						building.
					</motion.p>
				</div>

				{/* choose category */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="flex flex-row justify-start items-start flex-wrap gap-3 md:gap-5 my-5 mx-auto max-w-screen-2xl px-10">
					{Object.keys(category).map((key, index) => (
						<button
							key={index}
							className={`font-mono text-xs tracking-widest uppercase px-4 py-2 border transition-all ease duration-300 cursor-pointer ${
								activeCategory === key
									? "border-offwhite bg-offwhite text-charcoal"
									: "border-offwhite/30 text-softgray hover:border-offwhite hover:text-offwhite"
							}`}
							onClick={() => setActiveCategory(key)}>
							{category[key]}
						</button>
					))}
				</motion.div>

				{/* projects */}
				<div className="mx-auto max-w-screen-2xl gap-4 px-10 grid grid-cols-1 md:grid-cols-2 mb-10 cursor-pointer">
					{projects.map((project, index) => (
						<ProjectCard
							project={project}
							key={index}
							index={index}
							activeCategory={activeCategory}
						/>
					))}
				</div>

				{/* view in archive btn */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					className="flex justify-center items-center flex-col my-10">
					<Button variation="light">
						<Link href="projects/archive">View In Archive</Link>
					</Button>
				</motion.div>
			</main>
		</>
	);
}
