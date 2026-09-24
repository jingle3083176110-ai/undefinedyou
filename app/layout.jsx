import "./globals.css";
import Navbar from "@/components/Navbar";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import { Analytics } from "@vercel/analytics/react";
import ClientTopProgressBar from "@/components/ClientTopProgressBar";
import { LocaleProvider } from "@/components/LocaleProvider";

export const metadata = {
  metadataBase: new URL("https://undefinedyou.com"),

  title: {
    default: "undefinedyou",
    template: "%s | undefinedyou",
  },

  description: "A personal space for projects, writing, and life.",

  openGraph: {
    type: "website",
    url: "https://undefinedyou.com",
    title: "undefinedyou",
    siteName: "undefinedyou",
    description: "A personal space for projects, writing, and life.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "undefinedyou",
  url: "https://undefinedyou.com",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body suppressHydrationWarning>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
				<LocaleProvider>
					<ClientTopProgressBar />
					<Navbar />
					{children}
					<Analytics />
				</LocaleProvider>
			</body>
		</html>
	);
}
