"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import type { FeaturedProject } from "@/types/wordpress";

gsap.registerPlugin(ScrollTrigger);

// Append a tiny start offset so the first frame renders as a poster.
const withPosterFrame = (url: string | null | undefined) =>
  url ? (url.includes("#") ? url : `${url}#t=0.001`) : "";

export default function VideoStack({
  project,
}: {
  project?: FeaturedProject | null;
}) {
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

        const safePlay = (vid: HTMLVideoElement) => {
          const p = vid.play();
          if (p !== undefined) p.catch(() => {});
        };

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
                safePlay(video2);
                if (contentLabel) contentLabel.textContent = "02 - 03";
              } else if (self.progress < SWAP_AT && switched) {
                switched = false;
                video2.pause();
                safePlay(video1);
                if (contentLabel) contentLabel.textContent = "01 - 03";
              }
            },
            onEnter: () => {
              if (switched) safePlay(video2);
              else safePlay(video1);
            },
            onLeave: () => video2.pause(),
            onEnterBack: () => {
              if (switched) safePlay(video2);
              else safePlay(video1);
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

  // The reels are preload="none" so they stay off the initial load. Begin
  // buffering them ~one viewport before the section scrolls into view so they
  // play smoothly when the pinned timeline reaches them.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const videos = container.querySelectorAll("video");
    if (!videos.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          videos.forEach((v) => {
            v.preload = "auto";
            v.load();
          });
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" }
    );
    io.observe(container);
    return () => io.disconnect();
  }, []);

  return (
    <section className="video-stack" ref={containerRef}>

      <div className="overlay">
        <Image className="corner-circle tl" src="/media/wp-content/uploads/2026/04/grey-circle.png" alt="" width={40} height={40} sizes="3vw" />
        <Image className="corner-circle tr" src="/media/wp-content/uploads/2026/04/grey-circle.png" alt="" width={40} height={40} sizes="3vw" />
        <Image className="corner-circle bl" src="/media/wp-content/uploads/2026/04/grey-circle.png" alt="" width={40} height={40} sizes="3vw" />
        <div className="speaker-lines">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="speaker-line"
              style={{ animationDelay: `${(i * 0.07) % 0.5}s`, animationDuration: `${0.5 + (i % 5) * 0.15}s` }}
            />
          ))}
        </div>
        <Image className="corner-circle br" src="/media/wp-content/uploads/2026/04/grey-circle.png" alt="" width={40} height={40} sizes="3vw" />
        <div className="wrapper">
          <div className="top">
            <h3 className="h3 title dark" data-mask-up>{project?.projectName}</h3>
            <div className="meta-wrapper client">
              <p className="body grey" data-mask-up>CLIENT</p>
              <p className="body dark" data-mask-up>{project?.client}</p>
            </div>

            <div className="meta-wrapper year">
              <p className="body grey" data-mask-up>YEAR</p>
              <p className="body dark" data-mask-up>{project?.year}</p>
            </div>
          </div>
        </div>
      </div>

       <div className="cassete-wrapper">
          <Image className="roller" src="/media/wp-content/uploads/2026/04/cassete-roller.png" alt="" width={120} height={120} sizes="8vw" />
          <Image className="body" src="/media/wp-content/uploads/2026/04/cassete-body.png" alt="" width={900} height={266} sizes="(max-width: 768px) 50vw, 19vw" />
          <Image className="roller second" src="/media/wp-content/uploads/2026/04/cassete-roller.png" alt="" width={120} height={120} sizes="8vw" />
          <p className="content dark">01 - 03</p>
        </div>
      <div className="vs-base">

        <video
          className="vs-video-1"
          src={withPosterFrame(project?.video1)}
          muted
          playsInline
          loop
          preload="none"
        />
      </div>
      <div className="vs-slide">
        <video
          className="vs-video-2"
          src={withPosterFrame(project?.video2)}
          muted
          playsInline
          loop
          preload="none"
        />
      </div>
    </section>
  );
}