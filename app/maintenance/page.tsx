import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MAINTENANCE_MODE } from "@/lib/maintenance";

export const metadata: Metadata = {
  title: "Scheduled Maintenance",
  robots: { index: false, follow: false },
};

export default function Maintenance() {
  if (!MAINTENANCE_MODE) notFound();

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
