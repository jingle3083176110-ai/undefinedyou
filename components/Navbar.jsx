"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navVariant = {
	open: {
		clipPath: "circle(2000px at calc(100% - 40px) 40px)",
		transition: {
			type: "tween",
			duration: 0.5,
			ease: [0.22, 1, 0.36, 1],
		},
	},
	closed: {
		clipPath: "circle(0px at calc(100% - 40px) 40px)",
		transition: {
			delay: 0.3,
			type: "tween",
			duration: 0.3,
			ease: [0.4, 0, 1, 1],
		},
	},
};

const itemVariants = {
	open: (custom) => ({
		opacity: 1,
		x: 0,
		transition: {
			delay: custom,
			type: "tween",
			duration: 0.3,
			ease: [0.22, 1, 0.36, 1],
		},
	}),
	closed: {
		opacity: 0,
		x: -80,
		transition: {
			type: "tween",
			duration: 0.2,
		},
	},
};

const NavItems = ({ isNavOpen, setIsNavOpen, activeAnchor, onNavigate }) => {
	const handleItemClick = () => {
		setIsNavOpen(false);
	};

	const handleSectionClick = (event, anchor) => {
		event.preventDefault();
		onNavigate(anchor);
		handleItemClick();

		if (window.location.pathname === "/") {
			window.location.hash = anchor;
			return;
		}

		window.location.assign(`/#${anchor}`);
	};

	return (
		<>
			<motion.div
				className={`fixed z-[90] flex h-screen w-full items-center justify-center overflow-hidden ${isNavOpen ? "pointer-events-auto" : "pointer-events-none"}`}
				variants={navVariant}
				animate={isNavOpen ? "open" : "closed"}
				initial={false}>
				<div className="relative flex flex-col items-center space-x-8 min-h-[100vh] bg-cream min-w-[100vw] ">
					<div className="flex flex-col items-center space-y-8 my-auto mx-0 z-50">
						{/* title */}
						<motion.h1
							variants={itemVariants}
							animate={isNavOpen ? "open" : "closed"}
							className="font-serif text-6xl text-ink ">
							Menu
						</motion.h1>
						<Link href="/#home" onClick={(event) => handleSectionClick(event, "home")}>
							<div
							className={`text-2xl font-medium ${activeAnchor === "home" ? "text-[#8c3b2e]" : "text-ink"}`}
								onClick={handleItemClick}>
								<motion.h2
									className={activeAnchor === "home" ? "text-[#8c3b2e]" : "text-ink"}
									variants={itemVariants}
									animate={isNavOpen ? "open" : "closed"}
									custom={0.1}>
									Home
								</motion.h2>
							</div>
						</Link>
						<Link href="/#about" onClick={(event) => handleSectionClick(event, "about")}>
							<div
								onClick={handleItemClick}
								className={`text-2xl font-medium ${activeAnchor === "about" ? "text-[#8c3b2e]" : "text-ink"}`}>
								<motion.h2
									className={activeAnchor === "about" ? "text-[#8c3b2e]" : "text-ink"}
									variants={itemVariants}
									animate={isNavOpen ? "open" : "closed"}
									custom={0.2}>
									About
								</motion.h2>
							</div>
						</Link>
						<Link href="/#projects" onClick={(event) => handleSectionClick(event, "projects")}>
							<div
								onClick={handleItemClick}
								className={`text-2xl font-medium ${activeAnchor === "projects" ? "text-[#8c3b2e]" : "text-ink"}`}>
								<motion.h2
									className={activeAnchor === "projects" ? "text-[#8c3b2e]" : "text-ink"}
									variants={itemVariants}
									animate={isNavOpen ? "open" : "closed"}
									custom={0.3}>
									Projects
								</motion.h2>
							</div>
						</Link>

						<Link href="/#writing" onClick={(event) => handleSectionClick(event, "writing")}>
							<div
								onClick={handleItemClick}
								className={`text-2xl font-medium ${activeAnchor === "writing" ? "text-[#8c3b2e]" : "text-ink"}`}>
								<motion.h2
									className={activeAnchor === "writing" ? "text-[#8c3b2e]" : "text-ink"}
									variants={itemVariants}
									animate={isNavOpen ? "open" : "closed"}
									custom={0.4}>
								Writing
								</motion.h2>
							</div>
						</Link>

						<Link href="/#journal" onClick={(event) => handleSectionClick(event, "journal")}>
								<div
									onClick={handleItemClick}
									className={`text-2xl font-medium ${activeAnchor === "journal" ? "text-[#8c3b2e]" : "text-ink"}`}
>
									<motion.h2
										className={activeAnchor === "journal" ? "text-[#8c3b2e]" : "text-ink"}
										variants={itemVariants}
										animate={isNavOpen ? "open" : "closed"}
										custom={0.5}
									>
									Journal
									</motion.h2>
							</div>
						</Link>

						<Link href="/#contact" onClick={(event) => handleSectionClick(event, "contact")}>
							<div
								onClick={handleItemClick}
								className={`text-2xl font-medium ${activeAnchor === "contact" ? "text-[#8c3b2e]" : "text-ink"}`}>
								<motion.h2
									className={activeAnchor === "contact" ? "text-[#8c3b2e]" : "text-ink"}
									variants={itemVariants}
									animate={isNavOpen ? "open" : "closed"}
									custom={0.6}>
									Contact
								</motion.h2>
							</div>
						</Link>
					</div>
				</div>
			</motion.div>
		</>
	);
};

const Navbar = () => {
	const navRef = useRef(null);
	const [isNavOpen, setIsNavOpen] = useState(false);
	const [activeAnchor, setActiveAnchor] = useState("home");
	const pathname = usePathname();
	const router = useRouter();
	const isHome = pathname === "/";
	const showBack = !isHome;

	useEffect(() => {
		const syncAnchor = () => {
			const anchor = window.location.hash.slice(1);
			if (["home", "about", "projects", "writing", "journal", "contact"].includes(anchor)) {
				setActiveAnchor(anchor);
			}
		};
		const handleSectionChange = (event) => setActiveAnchor(event.detail);

		syncAnchor();
		window.addEventListener("hashchange", syncAnchor);
		window.addEventListener("fullpage-section-change", handleSectionChange);
		return () => {
			window.removeEventListener("hashchange", syncAnchor);
			window.removeEventListener("fullpage-section-change", handleSectionChange);
		};
	}, []);

	const toggleNav = () => {
		setIsNavOpen(!isNavOpen);
	};

	return (
		<>
			<nav
				ref={navRef}
				className="navbar px-5 md:px-24 fixed z-[100] flex h-16 w-screen flex-row items-center justify-between border-b border-ink/10 bg-cream/90 backdrop-blur-md">
				<div className="flex items-center gap-3">
				{showBack && (
					<button
						type="button"
						aria-label="Go back"
						onClick={() => router.back()}
						className="flex h-8 w-8 items-center justify-center font-sans text-2xl leading-none text-ink transition-transform hover:-translate-x-1"
					>
						‹
					</button>
				)}
				<h1
					className="font-serif text-2xl ml-2 md:ml-0 text-ink">
					undefinedyou
				</h1>
				</div>
				<div className="flex flex-row items-center">
					<button
						aria-label={isNavOpen ? "Close menu" : "Open menu"}
						className="burger button flex flex-col justify-center items-center space-y-1.5 "
						onClick={toggleNav}>
					<div
							className={`w-8 h-px bg-ink transition-all ease duration-300 ${
							isNavOpen ? "rotate-45 translate-y-[2px]" : ""
						}`}></div>
					<div
							className={`w-8 h-px bg-ink transition-all ease duration-300 ${
							isNavOpen ? "-rotate-45 -translate-y-[4px]" : ""
						}`}></div>
					</button>
				</div>
			</nav>
			{/* items */}
			<NavItems isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} activeAnchor={activeAnchor} onNavigate={setActiveAnchor} />
		</>
	);
};
export default Navbar;
