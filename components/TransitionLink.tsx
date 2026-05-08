"use client";

import { ComponentProps, MouseEvent } from "react";
import Link from "next/link";
import { usePageTransition } from "./PageTransition";

type Props = ComponentProps<typeof Link>;

export default function TransitionLink({ onClick, href, ...rest }: Props) {
  const ctx = usePageTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    const target = (e.currentTarget.getAttribute("target") || "").toLowerCase();
    if (target && target !== "_self") return;

    if (typeof href !== "string") return;
    if (
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("#")
    ) {
      return;
    }
    if (!ctx) return;

    e.preventDefault();
    ctx.navigate(href);
  };

  return <Link href={href} onClick={handleClick} {...rest} />;
}
