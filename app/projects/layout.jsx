import Footer from "@/components/Footer";

export const metadata = {
  title: "Projects",
  description:
    "Selected projects — things built while learning, exploring, and becoming.",
};
export default function Layout({ children }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}