import Footer from "@/components/Footer";

export const metadata = {
	title: "Journal",
	description: "Fragments of life — moments, photographs, reading, and places.",
};

export default function Layout({ children }) {
	return (
		<>
			{children}
			<Footer />
		</>
	);
}
