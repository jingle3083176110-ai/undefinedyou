"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHome,
	faUser,
	faFolderOpen,
	faPenNib,
	faBookOpen,
	faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { useFullPage } from "@alvalens/react-fullpage-snap";
import { motion } from "framer-motion";

const navItems = [
	{ icon: faHome, label: "Go to Home section", anchor: "home" },
	{ icon: faUser, label: "Go to About section", anchor: "about" },
	{ icon: faFolderOpen, label: "Go to Projects section", anchor: "projects" },
	{ icon: faPenNib, label: "Go to Writing section", anchor: "writing" },
	{ icon: faBookOpen, label: "Go to Journal section", anchor: "journal" },
	{ icon: faEnvelope, label: "Go to Contact section", anchor: "contact" },
];

const Sidebar = () => {
	const { moveTo, activeIndex } = useFullPage();

	return (
		<div className="hidden md:flex fixed z-40 h-[48vh] w-14 flex-col items-center rounded-r-3xl border border-l-0 border-ink/15 bg-cream/90 p-2.5 shadow-[8px_10px_24px_rgba(26,24,21,.08)] left-0 top-[26vh] backdrop-blur-sm">
			<ul
				id="sidebar"
			className="flex h-full flex-col items-center justify-evenly text-ink">
				{navItems.map((item, index) => (
					<li key={item.anchor} data-menuanchor={item.anchor}>
						<button
							aria-label={item.label}
							onClick={() => moveTo(index)}
							className="relative flex h-10 w-10 items-center justify-center rounded-2xl transition-colors duration-300 hover:bg-ink/8">
							{activeIndex === index && (
								<motion.div
									layoutId="sidebar-active"
									className="absolute inset-0 rounded-2xl bg-ink shadow-[0_5px_12px_rgba(26,24,21,.18)]"
									transition={{
										type: "spring",
										stiffness: 350,
										damping: 30,
									}}
								/>
							)}
							<FontAwesomeIcon
								icon={item.icon}
								className={`relative z-10 text-xl transition-transform duration-300 ${
									activeIndex === index
									? "scale-90 text-offwhite"
										: "scale-100"
								}`}
							/>
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Sidebar;
