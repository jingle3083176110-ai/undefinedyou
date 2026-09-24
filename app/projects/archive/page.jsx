"use client";
import { motion } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import Projects from "@/json/data.json";
import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";

export default function Page() {
	const { t } = useLocale();
	const projects = Projects.Projects;
	return (
		<>
			<main className="overflow-hidden bg-charcoal text-offwhite min-h-screen">
				<div className="min-h-screen w-screen p-10 pt-32 flex justify-start items-center flex-col mb-10 mx-auto max-w-screen-lg">
					<motion.h1
						className="font-serif text-4xl md:text-6xl self-start"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}>
						{t("projects.archive")}
					</motion.h1>
					<motion.p
						className="font-mono text-xs tracking-[0.3em] uppercase text-softgray mt-4 self-start"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.15 }}>
						{t("projects.archiveSummary")}
					</motion.p>

					<div className="w-full mt-16 border-t border-offwhite/15">
						{projects.map((project, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.05 }}
								className="grid grid-cols-[4rem_1fr_auto] items-baseline gap-6 py-6 border-b border-offwhite/15">
								<span className="font-mono text-xs text-softgray">
									{project.year}
								</span>
								<span>
									<Link
										href={`/projects/${project.slug}`}
										className="text-xl md:text-2xl font-medium hover:translate-x-2 inline-block transition-transform duration-300">
										{project.title}
									</Link>
									<span className="block font-mono text-xs text-softgray mt-2">
										{project.tech.join(" · ")}
									</span>
								</span>
								<span className="flex flex-row items-center gap-4">
									{project.code && (
										<a
											href={project.code}
											title="Link to GitHub"
											target="_blank"
											rel="noopener noreferrer">
											<FontAwesomeIcon icon={faGithub} className="text-xl" />
										</a>
									)}
									{project.preview && (
										<a
											href={project.preview}
											title="Link to project preview"
											target="_blank"
											rel="noopener noreferrer">
											<FontAwesomeIcon
												icon={faArrowUpRightFromSquare}
												className="text-xl"
											/>
										</a>
									)}
								</span>
							</motion.div>
						))}
					</div>
				</div>
			</main>
		</>
	);
}
