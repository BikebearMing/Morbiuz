"use client";

import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

type Ctx = {
  navigate: (href: string) => void;
};

const PageTransitionContext = createContext<Ctx | null>(null);

export function usePageTransition() {
  return useContext(PageTransitionContext);
}

const norm = (s: string) => s.replace(/\/$/, "") || "/";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<"idle" | "covering" | "covered" | "revealing">("idle");
  const pendingHrefRef = useRef<string | null>(null);
  const safetyRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!overlayRef.current) return;
    gsap.set(overlayRef.current, { yPercent: 100, autoAlpha: 0 });
  }, []);

  const reveal = useCallback(() => {
    if (stateRef.current !== "covered") return;
    pendingHrefRef.current = null;
    if (safetyRef.current) {
      clearTimeout(safetyRef.current);
      safetyRef.current = null;
    }

    requestAnimationFrame(() => {
      stateRef.current = "revealing";

      const tl = gsap.timeline({
        onComplete: () => {
          stateRef.current = "idle";
          delete document.body.dataset.transitioning;
          if (overlayRef.current) {
            gsap.set(overlayRef.current, { yPercent: 100, autoAlpha: 0 });
          }
          window.dispatchEvent(new CustomEvent("preloader-done"));
        },
      });

      // Animate past -100% so a mid-animation viewport resize
      // (mobile dynamic toolbar retracting) can't leave a residual strip.
      tl.to({}, { duration: 0.7 }).to(overlayRef.current, {
        yPercent: -110,
        duration: 1.1,
        ease: "power4.inOut",
      });
    });
  }, []);

  useEffect(() => {
    if (stateRef.current !== "covered") return;
    const target = pendingHrefRef.current;
    if (!target) return;
    if (norm(pathname) !== norm(target)) return;
    reveal();
  }, [pathname, reveal]);

  const navigate = (href: string) => {
    if (stateRef.current !== "idle") return;
    if (norm(pathname) === norm(href)) return;

    stateRef.current = "covering";
    pendingHrefRef.current = href;
    document.body.dataset.transitioning = "true";

    if (overlayRef.current) {
      gsap.set(overlayRef.current, { autoAlpha: 1 });
    }

    const tl = gsap.timeline({
      onComplete: () => {
        stateRef.current = "covered";
        router.push(href);

        // Safety net: if pathname doesn't update within 2.5s (slow RSC, dev mode,
        // or anything else holding navigation), reveal anyway so the overlay
        // never gets stuck on screen.
        if (safetyRef.current) clearTimeout(safetyRef.current);
        safetyRef.current = setTimeout(() => reveal(), 2500);
      },
    });

    tl.to(overlayRef.current, {
      yPercent: 0,
      duration: 0.85,
      ease: "power3.inOut",
    });
  };

  return (
    <PageTransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99998,
          background: "#ff3f01",
          pointerEvents: "none",
          willChange: "transform",
        }}
      />
    </PageTransitionContext.Provider>
  );
}
