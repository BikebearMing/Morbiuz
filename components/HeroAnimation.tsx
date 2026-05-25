"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
ScrollTrigger.config({ ignoreMobileResize: true });

export default function HeroAnimation({
  children,
}: {
  children: React.ReactNode;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasRevealedRef = useRef(false);

  useEffect(() => {
    let ctx: gsap.Context | null = null;
    let originalSubtextHtml: string | null = null;

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
        if (!hasRevealedRef.current) {
          gsap.set(images, { clipPath: "inset(100% 0 0 0)" });

          const revealImages = () => {
            hasRevealedRef.current = true;
            gsap.to(Array.from(images), {
              clipPath: "inset(0% 0 0 0)",
              duration: 1,
              ease: "power3.inOut",
              stagger: 0.12,
            });
          };

          const preloaderExists = document.querySelector("[data-preloader]") !== null;
          const transitioning = document.body.dataset.transitioning === "true";
          if (preloaderExists || transitioning) {
            window.addEventListener("preloader-done", revealImages, { once: true });
          } else {
            revealImages();
          }
        } else {
          gsap.set(images, { clipPath: "inset(0% 0 0 0)" });
        }

        // ---- Subhead bracket reveal ----
        const subheadText = section.querySelector(".subhead-text") as HTMLElement;
        if (subheadText) {
          const naturalWidth = subheadText.offsetWidth;
          console.log("subhead naturalWidth:", naturalWidth);

          if (!hasRevealedRef.current) {
            gsap.set(subheadText, { width: 0, overflow: "hidden" });

            gsap.to(subheadText, {
              width: naturalWidth,
              duration: 1.2,
              ease: "power2.out",
              delay: 0.5,
            });
          }
        }

        const orbitTl = gsap.timeline({
          scrollTrigger: {
            trigger: firstHalf,
            start: () =>
              window.innerWidth <= 768 ? "top top" : "bottom bottom",
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

        if (video) {
          const convergeEllipseY = ellipseCY + Math.sin(convergeAngle) * radiusY;

          const secondHalf = section.querySelector(".second-half") as HTMLElement;

          const isMobile = window.innerWidth <= 768;
          const vwSize = isMobile ? 0.36 : 0.17778;
          const squareScale = isMobile ? 1 : 0.7;
          const squareSize = window.innerWidth * vwSize * squareScale;
          const targetW16_9 = squareSize * (16 / 9);
          const scaleToFill = isMobile
            ? Math.min(
                window.innerWidth / targetW16_9,
                window.innerHeight / squareSize
              )
            : Math.max(
                window.innerWidth / targetW16_9,
                window.innerHeight / squareSize
              );

          // Set video to square size first, then measure its position
          const videoSetProps: any = {
            width: squareSize,
            height: squareSize,
            left: "50%",
            xPercent: -50,
            scale: 1,
            zIndex: 100,
          };
          if (isMobile) {
            videoSetProps.top = "50%";
            videoSetProps.yPercent = -50;
          }
          gsap.set(video, videoSetProps);

          const videoRect = video.getBoundingClientRect();
          const videoNaturalTop = videoRect.top - sectionRect.top;
          const videoCY = videoNaturalTop + videoRect.height / 2;
          const deltaY = videoCY - convergeEllipseY;
          const secondHalfRect = secondHalf.getBoundingClientRect();
          const secondHalfTop = secondHalfRect.top - sectionRect.top;
          // Use visualViewport when available — it's the only API that reports
          // the *real* visible viewport on mobile when the browser toolbar is
          // shown. window.innerHeight and CSS 100dvh can both report the larger
          // "no-toolbar" value, which would push the video below the visible area.
          const vvh = window.visualViewport?.height ?? window.innerHeight;
          const visibleHeight = Math.min(vvh, window.innerHeight, secondHalfRect.height);
          const desiredCenterInSH = visibleHeight / 2;
          const videoNaturalCenterInSH = videoNaturalTop - secondHalfTop + squareSize / 2;
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
              end: isMobile ? "top top" : "top 25%",
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
              { y: `+=${travelDistance}`, duration: 1, ease: "none", immediateRender: false },
              0
            );
            travelTl.to(
              img,
              { opacity: 0, duration: 0.8, ease: "none", immediateRender: false },
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
          const titleH2s = section.querySelectorAll(".video-zoom-wrapper .title h2") as NodeListOf<HTMLElement>;
          const subtextH4 = section.querySelector(".video-zoom-wrapper .subtext h4") as HTMLElement;

          if (titleEl) {
            gsap.set(titleEl, { y: restingY });
            gsap.set(titleH2s, { yPercent: 100 });
          }
          // Split h4 subtext into lines with overflow-hidden clips
          let subtextLines: HTMLElement[] = [];
          if (subtextH4) {
            if (originalSubtextHtml === null) {
              originalSubtextHtml = subtextH4.innerHTML;
            } else {
              subtextH4.innerHTML = originalSubtextHtml;
            }
            const text = subtextH4.textContent || "";
            // Temporarily render as word spans to measure line breaks
            subtextH4.innerHTML = text.split(" ").map((w) => `<span>${w}</span>`).join(" ");
            const wordSpans = subtextH4.querySelectorAll("span");

            const lineGroups: string[][] = [];
            let lastTop = -1;
            wordSpans.forEach((span) => {
              const top = span.getBoundingClientRect().top;
              if (Math.abs(top - lastTop) > 2 || lastTop === -1) {
                lineGroups.push([]);
                lastTop = top;
              }
              lineGroups[lineGroups.length - 1].push(span.textContent || "");
            });

            subtextH4.innerHTML = "";
            lineGroups.forEach((lineWords) => {
              const clip = document.createElement("div");
              clip.style.overflow = "hidden";
              clip.style.paddingBottom = "0.2em";
              const span = document.createElement("span");
              span.style.display = "block";
              span.textContent = lineWords.join(" ");
              clip.appendChild(span);
              subtextH4.appendChild(clip);
            });

            subtextLines = Array.from(subtextH4.querySelectorAll("span"));
            gsap.set(subtextLines, { yPercent: 100 });
          }

          // ---- Pin second-half: video expand + scale sequence ----
          const videoTl = gsap.timeline({
            scrollTrigger: {
              trigger: secondHalf,
              start: "top top",
              end: isMobile ? "+=80%" : "+=250%",
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

          // Title h2s slide up into view
          if (titleH2s.length) {
            videoTl.to(
              titleH2s,
              { yPercent: 0, duration: 0.15, ease: "power3.out", stagger: 0.05 },
              0.05
            );
          }

          // Subtext lines slide up into view one by one
          if (subtextLines.length) {
            videoTl.to(
              subtextLines,
              { yPercent: 0, duration: 0.15, ease: "power3.out", stagger: 0.04 },
              0.12
            );
          }

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

    let resizeTimer: ReturnType<typeof setTimeout>;
    let lastWidth = window.innerWidth;
    const WIDTH_THRESHOLD = 100;
    const onResize = () => {
      if (Math.abs(window.innerWidth - lastWidth) < WIDTH_THRESHOLD) return;
      lastWidth = window.innerWidth;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setup();
        ScrollTrigger.refresh();
      }, 300);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      if (ctx) ctx.revert();
      if (originalSubtextHtml !== null) {
        const h4 = sectionRef.current?.querySelector(".video-zoom-wrapper .subtext h4");
        if (h4) h4.innerHTML = originalSubtextHtml;
      }
    };
  }, []);

  return <div ref={sectionRef}>{children}</div>;
}
