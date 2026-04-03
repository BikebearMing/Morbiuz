"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export default function HeroAnimation({
  children,
}: {
  children: React.ReactNode;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: gsap.Context | null = null;

    function setup() {
      // Clean up previous
      if (ctx) ctx.revert();

      const section = sectionRef.current;
      if (!section) return;

      const firstHalf = section.querySelector(".first-half") as HTMLElement;
      const content = section.querySelector(".content") as HTMLElement;
      const images = section.querySelectorAll(
        ".image-parent > img"
      ) as NodeListOf<HTMLImageElement>;
      const video = section.querySelector(
        ".video-zoom-wrapper video"
      ) as HTMLVideoElement;

      if (!firstHalf || !content || images.length === 0) return;

      const sectionRect = section.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();

      const ellipseCX =
        contentRect.left - sectionRect.left + contentRect.width / 2;
      const ellipseCY =
        contentRect.top - sectionRect.top + contentRect.height / 2;

      const radiusX = window.innerWidth * 0.42;
      const radiusY = window.innerWidth * 0.22;

      const convergeAngle = Math.PI / 2;

      if (video) gsap.set(video, { scale: 0 });

      ctx = gsap.context(() => {
        const imageData = Array.from(images).map((img) => {
          const imgRect = img.getBoundingClientRect();
          const imgCenterX =
            imgRect.left - sectionRect.left + imgRect.width / 2;
          const imgCenterY =
            imgRect.top - sectionRect.top + imgRect.height / 2;

          const startAngle = Math.atan2(
            (imgCenterY - ellipseCY) / radiusY,
            (imgCenterX - ellipseCX) / radiusX
          );

          let fraction =
            ((convergeAngle - startAngle) % (2 * Math.PI)) / (2 * Math.PI);
          if (fraction <= 0) fraction += 1;

          return { img, startAngle, fraction, imgCenterX, imgCenterY };
        });

        const sorted = [...imageData].sort((a, b) => a.fraction - b.fraction);
        const arrivalOrder = new Map<HTMLImageElement, number>();
        sorted.forEach((d, i) => arrivalOrder.set(d.img, i));

        // ---- Subhead bracket reveal ----
        const subheadText = section.querySelector(".subhead-text") as HTMLElement;
        if (subheadText) {
          const naturalWidth = subheadText.offsetWidth;
          console.log("subhead naturalWidth:", naturalWidth);

          gsap.set(subheadText, { width: 0, overflow: "hidden" });

          gsap.to(subheadText, {
            width: naturalWidth,
            duration: 1.2,
            ease: "power2.out",
            delay: 0.5,
          });
        }

        const orbitTl = gsap.timeline({
          scrollTrigger: {
            trigger: firstHalf,
            start: "bottom bottom",
            end: "+=150%",
            scrub: 1.5,
            pin: true,
          },
        });

        imageData.forEach(({ img, startAngle, fraction, imgCenterX, imgCenterY }) => {
          gsap.set(img, { zIndex: arrivalOrder.get(img)! + 1 });

          const steps = Math.max(Math.round(fraction * 30), 2);
          const path: { x: number; y: number }[] = [{ x: 0, y: 0 }];
          for (let s = 1; s <= steps; s++) {
            const angle = startAngle + (2 * Math.PI * fraction * s) / steps;
            path.push({
              x: ellipseCX + Math.cos(angle) * radiusX - imgCenterX,
              y: ellipseCY + Math.sin(angle) * radiusY - imgCenterY,
            });
          }

          const peelOffTime = fraction;

          orbitTl.to(
            img,
            { scale: 0.7, duration: peelOffTime, ease: "power1.in" },
            0
          );

          orbitTl.to(
            img,
            {
              motionPath: { path, curviness: 1.5 },
              duration: peelOffTime,
              ease: "none",
            },
            0
          );
        });

        // ---- Scrub images down to video position ----
        if (video) {
          const convergeEllipseY = ellipseCY + Math.sin(convergeAngle) * radiusY;
          const videoRect = video.getBoundingClientRect();
          const videoCY =
            videoRect.top - sectionRect.top + videoRect.height / 2;

          const deltaY = videoCY - convergeEllipseY;

          const secondHalf = section.querySelector(".second-half") as HTMLElement;

          const travelTl = gsap.timeline({
            scrollTrigger: {
              trigger: secondHalf,
              start: "top 50%",
              end: "top 30%",
              scrub: 1.5,
            },
          });

          images.forEach((img) => {
            travelTl.to(
              img,
              {
                y: `+=${deltaY}`,
                duration: 1,
                ease: "none",
              },
              0
            );
            travelTl.to(
              img,
              {
                opacity: 0,
                duration: 0.8,
                ease: "none",
              },
              0.1
            );
          });

          // ---- Debug: check element positions ----
          const featuredSection = document.querySelector("section.featured-clients") as HTMLElement;
          if (featuredSection) {
            const fsRect = featuredSection.getBoundingClientRect();
            const shRect = secondHalf.getBoundingClientRect();
            console.log("=== POSITION DEBUG ===");
            console.log(`secondHalf: top=${shRect.top.toFixed(0)} bottom=${shRect.bottom.toFixed(0)} height=${shRect.height.toFixed(0)}`);
            console.log(`featuredClients: top=${fsRect.top.toFixed(0)} bottom=${fsRect.bottom.toFixed(0)}`);
            console.log(`secondHalf offsetTop=${secondHalf.offsetTop} offsetHeight=${secondHalf.offsetHeight}`);
            console.log(`featuredClients offsetTop=${featuredSection.offsetTop} offsetHeight=${featuredSection.offsetHeight}`);
            console.log(`home-hero height=${(section.querySelector('.home-hero') as HTMLElement)?.offsetHeight}`);
          }

          // ---- Pin second-half: video scale sequence ----
          const videoW = window.innerWidth * 0.17778;
          const scaleToFill = window.innerWidth / videoW;

          const videoTl = gsap.timeline({
            scrollTrigger: {
              trigger: secondHalf,
              start: "top top",
              end: "+=200%",
              scrub: 1.5,
              pin: true,
            },
          });

          gsap.set(video, { zIndex: 10 });

          const wrapper = section.querySelector(".video-zoom-wrapper") as HTMLElement;
          const titleEl = section.querySelector(".video-zoom-wrapper .title") as HTMLElement;
          const secondHalfRect = secondHalf.getBoundingClientRect();
          const titleRect = titleEl.getBoundingClientRect();
          const titleCenterInPinned = titleRect.top - secondHalfRect.top + titleRect.height / 2;
          const moveToCenter = window.innerHeight / 2 - titleCenterInPinned;

          videoTl.to(
            wrapper,
            { y: moveToCenter, duration: 0.2, ease: "power2.out" },
            0
          );

          videoTl.to(
            video,
            { scale: 1, duration: 0.2, ease: "power2.out" },
            0
          );

          let videoPlaying = false;
          videoTl.to(
            video,
            {
              scale: scaleToFill,
              duration: 0.65,
              ease: "power2.inOut",
              onUpdate: function () {
                if (this.progress() >= 0.5 && !videoPlaying) {
                  videoPlaying = true;
                  video.play();
                }
                if (this.progress() < 0.5 && videoPlaying) {
                  videoPlaying = false;
                  video.pause();
                }
              },
            },
            0.2
          );
        }
      }, section);
    }

    // Initial setup
    setup();

    // Rebuild on resize (debounced)
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        window.scrollTo(0, 0);
        setup();
      }, 300);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      if (ctx) ctx.revert();
    };
  }, []);

  return <div ref={sectionRef}>{children}</div>;
}
