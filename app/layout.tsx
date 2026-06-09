import type { Metadata, Viewport } from "next";
import { Outfit, Montserrat } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import DeferredFonts from "@/components/DeferredFonts";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/seo";
import "./globals.css";

const DEFAULT_TITLE = "Mobiuz — Stories that influence culture";
const DEFAULT_DESCRIPTION = "Stories that influence culture";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s — Mobiuz",
  },
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: "/",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#040704",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <head>
        {/* preconnect only — the actual font stylesheets are injected after
            hydration by <DeferredFonts /> so they don't block first render. */}
        <link rel="preconnect" href="https://use.typekit.net" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Preload the weight used by the large hero headline (h1 = 800) so the
            LCP text paints in the real font quickly. */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/fonts/mont_blanc/WEB/MontBlanc-Trial-ExtraBold.woff2"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <DeferredFonts />
        <div className="noise-overlay" />
        <PageTransition>
          <Navigation />
          <SmoothScroll>{children}</SmoothScroll>
          <Footer />
        </PageTransition>
      </body>
    </html>
  );
}
