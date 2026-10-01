import { Amiri, Inter, Playfair_Display } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  // The italic cut sets the gold accent word in the home page headlines.
  style: ["normal", "italic"],
});

// Arabic touches (the brand's one-word-per-piece rule) are always set in
// Amiri, in gold — the same face the social posts use.
const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.seoTitle,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Lazeez Bistro",
    "Arabic restaurant Kuala Lumpur",
    "Solaris Dutamas restaurant",
    "Publika restaurant",
    "mandi",
    "shawarma",
    "nasi lemak",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: site.seoTitle,
    description: site.description,
    url: "/",
    siteName: site.name,
    locale: "en_MY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.seoTitle,
    description: site.description,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${amiri.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
