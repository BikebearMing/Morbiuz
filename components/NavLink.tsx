"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import TransitionLink from "./TransitionLink";

type SubmenuItem = { id: string; href: string; label: string };

export default function NavLink({
  href,
  children,
  submenu,
}: {
  href: string;
  children: React.ReactNode;
  submenu?: SubmenuItem[];
}) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  const isActive =
    pathname === href ||
    pathname === href.replace(/\/$/, "") ||
    submenu?.some(
      (s) =>
        pathname === s.href || pathname === s.href.replace(/\/$/, "")
    );

  const hasSubmenu = submenu && submenu.length > 0;

  return (
    <li
      className={[
        isActive ? "nav-active" : "",
        hasSubmenu ? "has-submenu" : "",
        isExpanded ? "expanded" : ""
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <TransitionLink 
        href={href}
        onClick={(e) => {
          if (hasSubmenu && window.innerWidth <= 768) {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
      >
        {children}
      </TransitionLink>
      {hasSubmenu && (
        <ul className="submenu">
          {submenu!.map((s) => {
            const childActive =
              pathname === s.href ||
              pathname === s.href.replace(/\/$/, "");
            return (
              <li key={s.id} className={childActive ? "nav-active" : ""}>
                <TransitionLink href={s.href}>{s.label}</TransitionLink>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}
