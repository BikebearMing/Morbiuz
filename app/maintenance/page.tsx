import type { Metadata } from "next";
import Image from "next/image";

// Only reachable while maintenance mode is on — proxy.ts rewrites every page
// here and redirects /maintenance home otherwise. Header/footer are hidden via
// `body:has(.maintenance)` in globals.css.
export const metadata: Metadata = {
  title: "Scheduled Maintenance",
  robots: { index: false, follow: false },
};

export default function Maintenance() {
  return (
    <main className="maintenance">
      <Image
        className="maintenance-logo"
        src="/assets/logo.png"
        alt="Mobiuz"
        width={128}
        height={107}
        sizes="(max-width: 768px) 20vw, 6vw"
        preload
      />
      <h1 className="h1 maintenance-title">Scheduled Maintenance</h1>
      <p className="h2 maintenance-subtitle">We will be back soon</p>
    </main>
  );
}
