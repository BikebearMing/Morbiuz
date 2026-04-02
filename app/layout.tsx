import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const montBlanc = localFont({
  src: "../public/fonts/mont_blanc/MontBlanc-Trial-ExtraBold.ttf",
  variable: "--font-mont-blanc",
  weight: "800",
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
      </head>
      <body>{children}</body>
    </html>
  );
}
