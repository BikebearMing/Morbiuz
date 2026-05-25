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
    const speakerLines = container.querySelector(".speaker-lines") as HTMLElement;

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
      if (speakerLines) speakerLines.classList.add("playing");
    }

    function stopRollers() {
      rollerTween.current?.pause();
      if (speakerLines) speakerLines.classList.remove("playing");
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

        // Text mask-up reveal for h3, h4, p

        let switched = false;
        const SWAP_AT = 1 / 1.5;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "+=150%",
            scrub: 1.5,
            pin: true,
            onUpdate: (self) => {
              if (self.progress >= SWAP_AT && !switched) {
                switched = true;
                video1.pause();
                video2.play();
                if (contentLabel) contentLabel.textContent = "02 - 03";
              } else if (self.progress < SWAP_AT && switched) {
                switched = false;
                video2.pause();
                video1.play();
                if (contentLabel) contentLabel.textContent = "01 - 03";
              }
            },
            onEnter: () => {
              if (switched) video2.play();
              else video1.play();
            },
            onLeave: () => video2.pause(),
            onEnterBack: () => {
              if (switched) video2.play();
              else video1.play();
            },
            onLeaveBack: () => video1.pause(),
          },
        });

        tl.to(slide, {
          yPercent: 0,
          duration: 1,
          ease: "none",
        });
        tl.to({}, { duration: 0.5 });
      }, container!);
    }

    setup();

    return () => {
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

      <div className="overlay">
        <img className="corner-circle tl" src="https://morbiuz.mydemobb.com/wp-content/uploads/2026/04/grey-circle.png" alt="" />
        <img className="corner-circle tr" src="https://morbiuz.mydemobb.com/wp-content/uploads/2026/04/grey-circle.png" alt="" />
        <img className="corner-circle bl" src="https://morbiuz.mydemobb.com/wp-content/uploads/2026/04/grey-circle.png" alt="" />
        <div className="speaker-lines">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="speaker-line"
              style={{ animationDelay: `${(i * 0.07) % 0.5}s`, animationDuration: `${0.5 + (i % 5) * 0.15}s` }}
            />
          ))}
        </div>
        <img className="corner-circle br" src="https://morbiuz.mydemobb.com/wp-content/uploads/2026/04/grey-circle.png" alt="" />
        <div className="wrapper">
          <div className="top">
            <h3 className="h3 title dark" data-mask-up>室内高人 MV</h3>
            <div className="meta-wrapper client">
              <p className="body grey" data-mask-up>CLIENT</p>
              <p className="body dark" data-mask-up>NICOLE LAI</p>
            </div>

            <div className="meta-wrapper year">
              <p className="body grey" data-mask-up>YEAR</p>
              <p className="body dark" data-mask-up>2025</p>
            </div>
          </div>
        </div>
      </div>

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
          src="https://streamable.com/l/pb93s5/mp4.mp4"
          muted
          playsInline
          loop
          // poster="https://morbiuz.mydemobb.com/wp-content/uploads/2026/04/video-2-poster.avif"
        />
      </div>
    </section>
  );
}