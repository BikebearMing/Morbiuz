"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function VideoStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rollerTween = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const video1 = container.querySelector(".vs-video-1") as HTMLVideoElement;
    const video2 = container.querySelector(".vs-video-2") as HTMLVideoElement;
    const slide = container.querySelector(".vs-slide") as HTMLElement;
    const rollers = container.querySelectorAll(".roller");

    const contentLabel = container.querySelector(".cassete-wrapper .content") as HTMLElement;

    if (!video1 || !video2 || !slide) return;

    // Infinite spin tween, starts paused
    rollerTween.current = gsap.to(rollers, {
      rotation: 360,
      duration: 2,
      ease: "none",
      repeat: -1,
      paused: true,
    });

    function startRollers() {
      rollerTween.current?.play();
    }

    function stopRollers() {
      rollerTween.current?.pause();
    }

    // Sync rollers with video play/pause
    video1.addEventListener("play", startRollers);
    video1.addEventListener("pause", stopRollers);
    video2.addEventListener("play", startRollers);
    video2.addEventListener("pause", stopRollers);

    let ctx: gsap.Context | null = null;

    function setup() {
      if (ctx) ctx.revert();

      ctx = gsap.context(() => {
        gsap.set(slide, { yPercent: 100 });

        let switched = false;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "+=100%",
            scrub: 1.5,
            pin: true,
            onUpdate: (self) => {
              if (self.progress >= 0.5 && !switched) {
                switched = true;
                if (contentLabel) contentLabel.textContent = "02 - 03";
              } else if (self.progress < 0.5 && switched) {
                switched = false;
                if (contentLabel) contentLabel.textContent = "01 - 03";
              }
            },
            onEnter: () => video1.play(),
            onLeave: () => {
              video1.pause();
              video2.play();
            },
            onEnterBack: () => {
              video2.pause();
              video1.play();
            },
            onLeaveBack: () => video1.pause(),
          },
        });

        tl.to(slide, {
          yPercent: 0,
          duration: 1,
          ease: "none",
        });
      }, container);
    }

    setup();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setup, 300);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      video1.removeEventListener("play", startRollers);
      video1.removeEventListener("pause", stopRollers);
      video2.removeEventListener("play", startRollers);
      video2.removeEventListener("pause", stopRollers);
      rollerTween.current?.kill();
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section className="video-stack" ref={containerRef}>

       <div className="cassete-wrapper">
          <img className="roller" src="https://morbiuz.mydemobb.com/wp-content/uploads/2026/04/cassete-roller.png" alt="" />
          <img className="body" src="https://morbiuz.mydemobb.com/wp-content/uploads/2026/04/cassete-body.png" alt="" />
          <img className="roller second" src="https://morbiuz.mydemobb.com/wp-content/uploads/2026/04/cassete-roller.png" alt="" />
          <p className="content dark">01 - 03</p>
        </div>
      <div className="vs-base">

        <video
          className="vs-video-1"
          src="https://streamable.com/l/vcx2gh/mp4.mp4"
          muted
          playsInline
          loop
        />
      </div>
      <div className="vs-slide">
        <video
          className="vs-video-2"
          src="https://streamable.com/l/4wsqgh/mp4.mp4"
          muted
          playsInline
          loop
          poster="https://morbiuz.mydemobb.com/wp-content/uploads/2026/04/video-2-poster.avif"
        />
      </div>
    </section>
  );
}