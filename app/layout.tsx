import type { Metadata, Viewport } from "next";
import { Outfit, Montserrat } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mobiuz",
  description: "Stories that influence culture",
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
        <link rel="stylesheet" href="https://use.typekit.net/ekj7cky.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet" />
      </head>
      <body>
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
