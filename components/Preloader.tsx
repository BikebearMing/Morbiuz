"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// Module-level flag — survives client-side route remounts but resets on full reload.
// Ensures the preloader only ever runs on the cold load, not when the curtain
// transition brings the user back to "/".
let hasRunOnce = false;

const SPRITE_URL = "/assets/preloader-sprite.webp";
const SPRITE_COLS = 5;
const SPRITE_ROWS = 20;
const END_FRAME = 74; // 1-indexed; animation pauses here
const DISPLAY_SIZE = 96;

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [active] = useState(() => !hasRunOnce);
  const overlayRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const frameIndex = Math.min(
    END_FRAME - 1,
    Math.round((progress / 100) * (END_FRAME - 1))
  );
  const col = frameIndex % SPRITE_COLS;
  const row = Math.floor(frameIndex / SPRITE_COLS);

  useEffect(() => {
    if (!active) return;
    hasRunOnce = true;

    // Reset overlay position in case the DOM is being re-used by the router cache
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { yPercent: 0 });
    }
    setProgress(0);

    let loaded = false;
    let revealTl: gsap.core.Timeline | null = null;

    // Choreographed count: 0 → 100 over ~2.8s, driven by rAF (not GSAP timeline,
    // which can get stuck on remount in some routing edge cases).
    const start = performance.now();
    // Choreographed count durations (seconds). Kept short so the full-screen
    // preloader doesn't dominate Speed Index / the score on the cold load.
    const D1 = 0.25; // 0 → 30   (power1.out)
    const D2 = 0.45; // 30 → 70  (linear)
    const D3 = 0.35; // 70 → 100 (power2.in)
    const phase1 = D1;
    const phase2 = phase1 + D2;
    const total = phase2 + D3;
    let raf = 0;

    const tick = (now: number) => {
      const t = (now - start) / 1000;
      let value: number;
      if (t < phase1) {
        const local = t / phase1;
        value = 30 * (1 - Math.pow(1 - local, 2));
      } else if (t < phase2) {
        const local = (t - phase1) / D2;
        value = 30 + 40 * local;
      } else if (t < total) {
        const local = (t - phase2) / D3;
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

      revealTl = gsap.timeline({
        delay: 0.15,
        onComplete: () => {
          window.dispatchEvent(new CustomEvent("preloader-done"));
        },
      });

      if (barRef.current) {
        revealTl
          .to(barRef.current, {
            yPercent: 100,
            duration: 0.3,
            ease: "power3.in",
          })
          .set(barRef.current, { display: "none" });
      }

      revealTl.to(
        overlayRef.current,
        {
          yPercent: -100,
          duration: 0.9,
          ease: "power4.inOut",
        },
        "+=0.05"
      );
    };

    return () => {
      cancelAnimationFrame(raf);
      revealTl?.kill();
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
      <div
        role="img"
        aria-label="Morbiuz"
        style={{
          width: `${DISPLAY_SIZE}px`,
          height: `${DISPLAY_SIZE}px`,
          backgroundImage: `url(${SPRITE_URL})`,
          backgroundSize: `${SPRITE_COLS * DISPLAY_SIZE}px ${SPRITE_ROWS * DISPLAY_SIZE}px`,
          backgroundPosition: `${-col * DISPLAY_SIZE}px ${-row * DISPLAY_SIZE}px`,
          backgroundRepeat: "no-repeat",
        }}
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
      <div
        ref={barRef}
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100vw",
          height: "3px",
          background: "rgba(255, 255, 255, 0.08)",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "var(--orange)",
            transition: "width 80ms linear",
          }}
        />
      </div>
    </div>
  );
}
