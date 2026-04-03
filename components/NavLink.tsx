"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname === href.replace(/\/$/, "");

  return (
    <li className={isActive ? "nav-active" : ""}>
      <Link href={href}>{children}</Link>
    </li>
  );
}
