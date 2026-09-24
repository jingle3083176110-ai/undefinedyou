import Footer from "@/components/Footer";

export const metadata = {
	title: "Writing",
	description: "Essays, ideas, technology, learning, and thoughts worth keeping.",
};

export default function Layout({ children }) {
	return (
		<>
			{children}
			<Footer />
		</>
	);
}
