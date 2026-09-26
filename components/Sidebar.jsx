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
import { useLocale } from "@/components/LocaleProvider";

const navItems = [
	{ icon: faHome, labelKey: "nav.home", anchor: "home" },
	{ icon: faUser, labelKey: "nav.about", anchor: "about" },
	{ icon: faFolderOpen, labelKey: "nav.projects", anchor: "projects" },
	{ icon: faPenNib, labelKey: "nav.academic", anchor: "writing" },
	{ icon: faBookOpen, labelKey: "nav.journal", anchor: "journal" },
	{ icon: faEnvelope, labelKey: "nav.contact", anchor: "contact" },
];

const Sidebar = () => {
	const { moveTo, activeIndex } = useFullPage();
	const { t } = useLocale();

	return (
		<div className="hidden md:flex fixed z-40 h-[48vh] w-14 flex-col items-center rounded-r-3xl border border-l-0 border-ink/15 bg-cream/90 p-2.5 shadow-[8px_10px_24px_rgba(26,24,21,.08)] left-0 top-[26vh] backdrop-blur-sm">
			<ul
				id="sidebar"
			className="flex h-full flex-col items-center justify-evenly text-ink">
				{navItems.map((item, index) => (
					<li key={item.anchor} data-menuanchor={item.anchor}>
						<button
							aria-label={t("nav.goTo").replace("{section}", t(item.labelKey))}
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
