"use client";

import { useEffect } from "react";

export default function HeaderScroll() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".header");
    if (!header) return;

    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY;

      if (currentY < 10) {
        header.classList.remove("header-hidden");
      } else if (delta > 4) {
        header.classList.add("header-hidden");
      } else if (delta < -4) {
        header.classList.remove("header-hidden");
      }

      lastY = currentY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
