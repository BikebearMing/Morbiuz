"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function VideoStack() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const video1 = container.querySelector(".vs-video-1") as HTMLVideoElement;
    const video2 = container.querySelector(".vs-video-2") as HTMLVideoElement;
    const slide = container.querySelector(".vs-slide") as HTMLElement;

    if (!video1 || !video2 || !slide) return;

    let ctx: gsap.Context | null = null;

    function setup() {
      if (ctx) ctx.revert();

      ctx = gsap.context(() => {
        // Video 2 starts off-screen below
        gsap.set(slide, { yPercent: 100 });

        // Pin container, slide video 2 up over video 1
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "+=100%",
            scrub: 1.5,
            pin: true,
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
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section className="video-stack" ref={containerRef}>
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
