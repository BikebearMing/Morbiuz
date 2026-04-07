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

        // ---- Image clip-path reveal (after preloader) ----
        gsap.set(images, { clipPath: "inset(100% 0 0 0)" });

        const revealImages = () => {
          gsap.to(Array.from(images), {
            clipPath: "inset(0% 0 0 0)",
            duration: 1,
            ease: "power3.inOut",
            stagger: 0.12,
          });
        };

        window.addEventListener("preloader-done", revealImages, { once: true });

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

        // ---- Scrub images + video down to second-half ----
        if (video) {
          const convergeEllipseY = ellipseCY + Math.sin(convergeAngle) * radiusY;

          const secondHalf = section.querySelector(".second-half") as HTMLElement;

          const squareSize = window.innerWidth * 0.17778 * 0.7; // 17.778vw × 0.7 scale
          const targetW16_9 = squareSize * (16 / 9);
          const scaleToFill = Math.max(
            window.innerWidth / targetW16_9,
            window.innerHeight / squareSize
          );

          // Set video to square size first, then measure its position
          gsap.set(video, {
            width: squareSize,
            height: squareSize,
            left: "50%",
            xPercent: -50,
            scale: 1,
            zIndex: 100,
          });

          const videoRect = video.getBoundingClientRect();
          const videoNaturalTop = videoRect.top - sectionRect.top;
          const videoCY = videoNaturalTop + videoRect.height / 2;
          const deltaY = videoCY - convergeEllipseY;

          // Where the video should rest when pin starts (viewport center)
          const secondHalfRect = secondHalf.getBoundingClientRect();
          const secondHalfTop = secondHalfRect.top - sectionRect.top;
          // When pinned, secondHalf top = viewport top, so video center should be at viewport center
          const desiredCenterInSH = window.innerHeight / 2;
          // Video's natural center relative to secondHalf
          const videoNaturalCenterInSH = videoNaturalTop - secondHalfTop + squareSize / 2;
          // Offset to move video to viewport center during pin
          const restingY = desiredCenterInSH - videoNaturalCenterInSH;

          // Now hide it and position at converge point
          gsap.set(video, {
            scale: 0,
            y: -deltaY,
          });

          // ---- Travel timeline: video appears + everything moves down ----
          const travelTl = gsap.timeline({
            scrollTrigger: {
              trigger: secondHalf,
              start: "top 60%",
              end: "top 25%",
              scrub: 1.5,
            },
          });

          // Video reveals as square at the start of travel
          travelTl.to(
            video,
            { scale: 1, duration: 0.15, ease: "power2.out" },
            0
          );

          // How far everything actually travels (converge point → viewport center of pinned section)
          const travelDistance = deltaY + restingY;

          // Images + video all travel down together
          images.forEach((img) => {
            travelTl.to(
              img,
              { y: `+=${travelDistance}`, duration: 1, ease: "none" },
              0
            );
            travelTl.to(
              img,
              { opacity: 0, duration: 0.8, ease: "none" },
              0.1
            );
          });

          // Video travels down too (from -deltaY to restingY)
          travelTl.to(
            video,
            { y: restingY, duration: 1, ease: "none" },
            0
          );

          // ---- Move title + subtext up to match video's resting position ----
          const titleEl = section.querySelector(".video-zoom-wrapper .title") as HTMLElement;
          const subtextEl = section.querySelector(".video-zoom-wrapper .subtext") as HTMLElement;

          if (titleEl) gsap.set(titleEl, { y: restingY });
          if (subtextEl) {
            // Position subtext just below the video
            const subtextRect = subtextEl.getBoundingClientRect();
            const subtextNaturalTop = subtextRect.top - secondHalfRect.top;
            // Video bottom in pinned viewport = viewport center + half square
            const videoBottomInSH = desiredCenterInSH + squareSize / 2;
            const subtextTargetY = videoBottomInSH - subtextNaturalTop + window.innerHeight * 0.55;
            gsap.set(subtextEl, { y: subtextTargetY });
          }

          // ---- Pin second-half: video expand + scale sequence ----
          const videoTl = gsap.timeline({
            scrollTrigger: {
              trigger: secondHalf,
              start: "top top",
              end: "+=250%",
              scrub: 1.5,
              pin: true,
            },
          });

          // Phase 1: expand width to 16:9 (height stays, width grows)
          videoTl.to(
            video,
            { width: targetW16_9, duration: 0.25, ease: "power2.inOut" },
            0
          );

          // Phase 2: scale to fill viewport
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
            0.25
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
