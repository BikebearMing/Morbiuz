import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import localFont from "next/font/local";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import SplitTextReveal from "@/components/SplitTextReveal";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const montBlanc = localFont({
  src: [
    { path: "../public/fonts/mont_blanc/MontBlanc-Trial-Thin.ttf", weight: "100", style: "normal" },
    { path: "../public/fonts/mont_blanc/MontBlanc-Trial-ExtraLight.ttf", weight: "200", style: "normal" },
    { path: "../public/fonts/mont_blanc/MontBlanc-Trial-Light.ttf", weight: "300", style: "normal" },
    { path: "../public/fonts/mont_blanc/MontBlanc-Trial-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/mont_blanc/MontBlanc-Trial-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/mont_blanc/MontBlanc-Trial-Bold.ttf", weight: "700", style: "normal" },
    { path: "../public/fonts/mont_blanc/MontBlanc-Trial-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "../public/fonts/mont_blanc/MontBlanc-Trial-Black.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-mont-blanc",
});

export const metadata: Metadata = {
  title: "Morbiuz",
  description: "Stories that influence culture",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${montBlanc.variable}`}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/ekj7cky.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="noise-overlay" />
        <Preloader />
        <Navigation />
        <SplitTextReveal />
        <SmoothScroll>{children}</SmoothScroll>
        <Footer />
      </body>
    </html>
  );
}
