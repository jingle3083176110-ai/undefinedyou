import Footer from "@/components/Footer";

export const metadata = {
  title: "About",
  description:
    "A student, a builder, and someone still figuring things out.",
};
export default function Layout({ children }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
