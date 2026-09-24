"use client";
import Sidebar from "@/components/Sidebar";
import ControlledSectionScroll from "@/components/ControlledSectionScroll";
import HashSectionSync from "@/components/HashSectionSync";
import { FullPageProvider } from "@alvalens/react-fullpage-snap";

export default function RootLayout({ children }) {
	return (
		<FullPageProvider
			anchors={["home", "about", "projects", "writing", "journal", "contact"]}
			scrollingSpeed={750}
			menu="#sidebar"
			wheelScrolling={false}
			lockAnchors={false}
			onSectionChange={(_, nextIndex) => {
				const anchors = ["home", "about", "projects", "writing", "journal", "contact"];
				window.dispatchEvent(new CustomEvent("fullpage-section-change", { detail: anchors[nextIndex] }));
			}}>
			<ControlledSectionScroll />
			<HashSectionSync />
			<Sidebar />
			{children}
		</FullPageProvider>
	);
}
