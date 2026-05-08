"use client";

import { createContext, useContext, useEffect, useRef } from "react";
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

  useEffect(() => {
    if (!overlayRef.current) return;
    gsap.set(overlayRef.current, { yPercent: 100 });
  }, []);

  useEffect(() => {
    if (stateRef.current !== "covered") return;
    const target = pendingHrefRef.current;
    if (!target) return;
    if (norm(pathname) !== norm(target)) return;
    pendingHrefRef.current = null;

    requestAnimationFrame(() => {
      stateRef.current = "revealing";

      const tl = gsap.timeline({
        onComplete: () => {
          stateRef.current = "idle";
          delete document.body.dataset.transitioning;
          if (overlayRef.current) gsap.set(overlayRef.current, { yPercent: 100 });
          window.dispatchEvent(new CustomEvent("preloader-done"));
        },
      });

      tl.to({}, { duration: 0.7 }).to(overlayRef.current, {
        yPercent: -100,
        duration: 1.1,
        ease: "power4.inOut",
      });
    });
  }, [pathname]);

  const navigate = (href: string) => {
    if (stateRef.current !== "idle") return;
    if (norm(pathname) === norm(href)) return;

    stateRef.current = "covering";
    pendingHrefRef.current = href;
    document.body.dataset.transitioning = "true";

    const tl = gsap.timeline({
      onComplete: () => {
        stateRef.current = "covered";
        router.push(href);
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
