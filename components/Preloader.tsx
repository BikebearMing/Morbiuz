"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// Module-level flag — survives client-side route remounts but resets on full reload.
// Ensures the preloader only ever runs on the cold load, not when the curtain
// transition brings the user back to "/".
let hasRunOnce = false;

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [active] = useState(() => !hasRunOnce);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    hasRunOnce = true;

    // Reset overlay position in case the DOM is being re-used by the router cache
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { yPercent: 0 });
    }
    setProgress(0);

    let loaded = false;
    let revealTween: gsap.core.Tween | null = null;

    // Choreographed count: 0 → 100 over ~2.8s, driven by rAF (not GSAP timeline,
    // which can get stuck on remount in some routing edge cases).
    const start = performance.now();
    const phase1 = 0.6;             // 0 → 30   (power1.out)
    const phase2 = phase1 + 1.2;    // 30 → 70  (linear)
    const total  = phase2 + 1.0;    // 70 → 100 (power2.in)
    let raf = 0;

    const tick = (now: number) => {
      const t = (now - start) / 1000;
      let value: number;
      if (t < phase1) {
        const local = t / phase1;
        value = 30 * (1 - Math.pow(1 - local, 2));
      } else if (t < phase2) {
        const local = (t - phase1) / 1.2;
        value = 30 + 40 * local;
      } else if (t < total) {
        const local = (t - phase2) / 1.0;
        value = 70 + 30 * (local * local);
      } else {
        value = 100;
      }
      setProgress(Math.round(value));
      if (t < total) {
        raf = requestAnimationFrame(tick);
      } else {
        loaded = true;
        reveal();
      }
    };
    raf = requestAnimationFrame(tick);

    // Also wait for real window.load — whichever is later wins
    const onLoad = () => {
      loaded = true;
    };

    if (document.readyState === "complete") {
      loaded = true;
    } else {
      window.addEventListener("load", onLoad);
    }

    const reveal = () => {
      if (!loaded || !overlayRef.current) return;

      revealTween = gsap.to(overlayRef.current, {
        yPercent: -100,
        duration: 1.4,
        ease: "power4.inOut",
        delay: 0.3,
        onComplete: () => {
          window.dispatchEvent(new CustomEvent("preloader-done"));
        },
      });
    };

    return () => {
      cancelAnimationFrame(raf);
      revealTween?.kill();
      window.removeEventListener("load", onLoad);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={overlayRef}
      data-preloader=""
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "var(--black)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
      }}
    >
      <img
        src="https://morbiuz.mydemobb.com/wp-content/uploads/2026/04/Vector.png"
        alt="Morbiuz"
        style={{ width: "48px", height: "auto" }}
      />
      <span
        style={{
          fontFamily: "var(--font-outfit)",
          fontSize: "12px",
          color: "var(--white)",
          opacity: 0.6,
          letterSpacing: "1px",
        }}
      >
        {progress} %
      </span>
    </div>
  );
}
