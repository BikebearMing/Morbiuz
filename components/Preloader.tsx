"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const counter = { value: 0 };
    let loaded = false;

    // Choreographed count: 0 → 100 over ~2.8s with a deliberate pause
    const tl = gsap.timeline();

    // 0 → 30 (fast start)
    tl.to(counter, {
      value: 30,
      duration: 0.6,
      ease: "power1.out",
      onUpdate: () => setProgress(Math.round(counter.value)),
    });

    // 30 → 70 (slower, deliberate)
    tl.to(counter, {
      value: 70,
      duration: 1.2,
      ease: "none",
      onUpdate: () => setProgress(Math.round(counter.value)),
    });

    // 70 → 100 (accelerate to finish)
    tl.to(counter, {
      value: 100,
      duration: 1,
      ease: "power2.in",
      onUpdate: () => setProgress(Math.round(counter.value)),
      onComplete: () => {
        loaded = true;
        reveal();
      },
    });

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
      if (!loaded) return;

      gsap.to(overlayRef.current, {
        yPercent: -100,
        duration: 1.4,
        ease: "power4.inOut",
        delay: 0.3,
      });
    };

    return () => {
      tl.kill();
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
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
