"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function HamburgerToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Close menu on route change
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const header = document.querySelector(".header");
    if (header) {
      if (isOpen) {
        header.classList.add("menu-open");
        document.body.style.overflow = "hidden";
      } else {
        header.classList.remove("menu-open");
        document.body.style.overflow = "";
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <button 
      className={`hamburger ${isOpen ? "active" : ""}`}
      onClick={() => setIsOpen(!isOpen)}
      aria-label="Toggle menu"
    >
      <span />
      <span />
      <span />
    </button>
  );
}
