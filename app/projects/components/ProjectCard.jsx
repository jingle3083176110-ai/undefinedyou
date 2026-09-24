import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import BlurImage from "@/public/image/placeholder/blur.jpg";

export default function ProjectCard({ project, index, activeCategory }) {
	return (
		<>
			{project.category.includes(parseInt(activeCategory)) && (
				<Link href={`/projects/${project.slug}`} key={index}>
					<motion.div
						className="z-10 relative flex justify-center items-start flex-col mb-5 w-full h-auto border border-offwhite/15 bg-nearblack group/tes py-20 px-5 md:py-2 aspect-video"
						initial={{
							opacity: 0,
							y: 30,
						}}
						whileInView={{
							opacity: 1,
							y: 0,
						}}
						transition={{
							duration: 0.6,
						}}>
						{project.thumbnail && (
							<Image
								src={project.thumbnail}
								alt={project.title}
								fill
								placeholder="blur"
								className="opacity-10 group-hover/tes:opacity-60 transition-all ease duration-500 object-cover"
								blurDataURL={BlurImage.src}
							/>
						)}
						<div className="absolute top-0 left-0 border-b border-r border-offwhite/15 px-4 py-2">
							<h4 className="font-mono text-xs text-softgray">{project.year}</h4>
						</div>
						<div className="transition-all ease duration-500 opacity-100 content text-center z-10 w-full">
							<h1 className="font-serif text-3xl mb-3 text-offwhite">
								{project.title}
							</h1>
							<p className="text-softgray">
								{project.desc[0].length > 125
									? `${project.desc[0].slice(0, 125)}...`
									: project.desc[0]}
							</p>
							<div className="flex justify-center items-center flex-row mt-5 flex-wrap">
								{project.tech.map((t, index) => (
									<span
										key={index}
										className="font-mono text-xs m-1 px-3 py-1 border border-offwhite/20 text-softgray">
										{t}
									</span>
								))}
							</div>
						</div>
					</motion.div>
				</Link>
			)}
		</>
	);
}

ProjectCard.propTypes = {
	project: PropTypes.object.isRequired,
	index: PropTypes.number.isRequired,
	activeCategory: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
		.isRequired,
};
