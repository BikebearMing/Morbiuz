"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function splitTextContent(text: string, container: HTMLElement) {
  const words = text.split(/(\s+)/);

  words.forEach((word) => {
    if (/^\s+$/.test(word)) {
      const space = document.createElement("span");
      space.className = "split-space";
      space.innerHTML = "&nbsp;";
      container.appendChild(space);
      return;
    }

    const wordSpan = document.createElement("span");
    wordSpan.className = "split-word";

    word.split("").forEach((char) => {
      const clip = document.createElement("span");
      clip.className = "split-char-clip";

      const letter = document.createElement("span");
      letter.className = "split-char";
      letter.textContent = char;

      clip.appendChild(letter);
      wordSpan.appendChild(clip);
    });

    container.appendChild(wordSpan);
  });
}

const PRESERVE_CLASSES = ["cursive", "client-slash"];

function walkAndSplit(container: HTMLElement, output: HTMLElement) {
  Array.from(container.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      splitTextContent(node.textContent || "", output);
    } else if (
      node instanceof HTMLElement &&
      PRESERVE_CLASSES.some((cls) => node.classList.contains(cls))
    ) {
      output.appendChild(node.cloneNode(true));
    } else if (node instanceof HTMLElement) {
      // Recurse into child elements
      walkAndSplit(node, output);
    }
  });
}

function splitElement(el: HTMLElement) {
  const text = el.textContent || "";
  el.setAttribute("aria-label", text);

  const fragment = document.createElement("div");
  walkAndSplit(el, fragment);

  el.innerHTML = "";
  while (fragment.firstChild) {
    el.appendChild(fragment.firstChild);
  }

  return el.querySelectorAll(".split-char");
}

function animateElement(el: HTMLElement) {
  const chars = splitElement(el);
  if (!chars.length) return;

  const mode = el.getAttribute("data-split-text");
  const shuffled = shuffle(Array.from(chars));

  gsap.set(chars, { yPercent: 100 });

  if (mode === "scroll") {
    gsap.to(shuffled, {
      yPercent: 0,
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.025,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  } else {
    gsap.to(shuffled, {
      yPercent: 0,
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.025,
      delay: 0.3,
    });
  }
}

export default function SplitTextReveal() {
  useEffect(() => {
    const ctx = gsap.context(() => {});
    const elements = document.querySelectorAll<HTMLElement>("[data-split-text]");
    const originalHtmlByElement = new Map<HTMLElement, string>();

    // Split immediately (so text is hidden), but don't animate yet
    const allChars: { el: HTMLElement; chars: NodeListOf<Element>; mode: string | null }[] = [];
    const cursiveEls: HTMLElement[] = [];
    ctx.add(() => {
      elements.forEach((el) => {
        originalHtmlByElement.set(el, el.innerHTML);
        const chars = splitElement(el);
        if (chars.length) {
          gsap.set(chars, { yPercent: 100 });
          allChars.push({ el, chars, mode: el.getAttribute("data-split-text") });
        }
        el.querySelectorAll<HTMLElement>(".cursive").forEach((c) => {
          gsap.set(c, { clipPath: "inset(100% 0 0 0)", display: "inline-block" });
          cursiveEls.push(c);
        });
      });
    });

    const startAnimations = () => {
      ctx.add(() => {
        // Reveal cursive in parallel with chars so it doesn't depend on
        // the chars tween's onComplete (which can be killed/overwritten).
        if (cursiveEls.length) {
          gsap.to(cursiveEls, {
            clipPath: "inset(0% 0 0 0)",
            duration: 0.5,
            ease: "power3.out",
            delay: 0.5,
          });
        }

        allChars.forEach(({ el, chars, mode }) => {
          const shuffled = shuffle(Array.from(chars));

          if (mode === "scroll") {
            gsap.to(shuffled, {
              yPercent: 0,
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.025,
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            });
          } else {
            gsap.to(shuffled, {
              yPercent: 0,
              duration: 0.4,
              ease: "power3.out",
              stagger: 0.015,
              delay: 0.2,
            });
          }
        });
      });
    };

    // Wait for the preloader OR the page-transition curtain — both dispatch
    // "preloader-done" when they finish revealing. If neither is active
    // (cold load on a non-home page), reveal immediately.
    const preloaderExists = document.querySelector("[data-preloader]") !== null;
    const transitioning = document.body.dataset.transitioning === "true";
    if (preloaderExists || transitioning) {
      window.addEventListener("preloader-done", startAnimations, { once: true });
    } else {
      requestAnimationFrame(() => startAnimations());
    }

    // ---- data-mask-up: whole-line clip reveal ----
    const maskUpEls = document.querySelectorAll<HTMLElement>("[data-mask-up]");
    const maskUpWrappers: HTMLElement[] = [];

    ctx.add(() => {
      maskUpEls.forEach((el) => {
        const wrapper = document.createElement("div");
        wrapper.style.overflow = "hidden";
        el.parentNode!.insertBefore(wrapper, el);
        wrapper.appendChild(el);
        wrapper.style.height = (el.offsetHeight + 10) + "px";
        maskUpWrappers.push(wrapper);
        gsap.set(el, { y: wrapper.offsetHeight });
      });
    });

    // Wait for all other ScrollTriggers (pins) to be created, then set up mask-up triggers + parallax
    const maskUpTimeout = setTimeout(() => {
      ctx.add(() => {
      ScrollTrigger.refresh();
      maskUpWrappers.forEach((wrapper) => {
        const el = wrapper.firstElementChild as HTMLElement;
        if (!el) return;
        gsap.to(el, {
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapper,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // Parallax on .parallax-container img:first-child
      const parallaxBg = document.querySelector<HTMLElement>(".our-team .parallax-container img:first-child");
      const ourTeam = document.querySelector<HTMLElement>(".our-team");
      const parallaxPpl = document.querySelector<HTMLElement>(".our-team .parallax-container img:last-child");
      if (parallaxBg && ourTeam) {
        gsap.fromTo(parallaxBg,
          { y: -80 },
          {
            y: 80,
            ease: "none",
            scrollTrigger: {
              trigger: ourTeam,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
        if (parallaxPpl) {
          gsap.fromTo(parallaxPpl,
            { y: -60 },
            {
              y: 60,
              ease: "none",
              scrollTrigger: {
                trigger: ourTeam,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
      }

      // Parallax on about page banner image
      const aboutBanner = document.querySelector<HTMLElement>(".parallax-banner");
      const aboutBannerImg = document.querySelector<HTMLElement>(".parallax-banner .parallax-container img");
      if (aboutBanner && aboutBannerImg) {
        gsap.fromTo(aboutBannerImg,
          { y: -80 },
          {
            y: 80,
            ease: "none",
            scrollTrigger: {
              trigger: aboutBanner,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // Sliding cards reveal on about page
      const slidingWrapper = document.querySelector<HTMLElement>(".sliding-cards-wrapper");
      const slidingCards = document.querySelectorAll<HTMLElement>(".sliding-cards-wrapper img");
      if (slidingWrapper && slidingCards.length === 3) {
        const vw = window.innerWidth / 100;
        const cardsTl = gsap.timeline({
          scrollTrigger: {
            trigger: slidingWrapper,
            start: "top 55%",
            end: "top 5%",
            scrub: 1,
          },
        });
        cardsTl
          .to(slidingCards[0], { rotation: -2.184, x: 1.5 * vw, y: -0.5 * vw, ease: "none" }, 0)
          .to(slidingCards[1], { rotation: 6.471,  x: 7 * vw,   y: -2.5 * vw, ease: "none" }, 0.15)
          .to(slidingCards[2], {                   x: 13 * vw,  y: -5 * vw,   ease: "none" }, 0.3);
      }

      // Contact FAQ left images: card swap on scroll
      const faqLeft = document.querySelector<HTMLElement>(".contact-faq .left");
      const faqImgs = document.querySelectorAll<HTMLElement>(".contact-faq .left img");
      if (faqLeft && faqImgs.length === 2) {
        const vw = window.innerWidth / 100;
        const swapTl = gsap.timeline({
          scrollTrigger: {
            trigger: faqLeft,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        });
        swapTl
          .to(faqImgs[0], {
            left: 10.417 * vw,
            rotation: 9.6,
            duration: 1.2,
            ease: "power2.inOut",
          }, 0)
          .to(faqImgs[0], {
            y: -2.5 * vw,
            duration: 0.6,
            ease: "power2.out",
          }, 0)
          .to(faqImgs[0], {
            y: 0,
            duration: 0.6,
            ease: "power2.in",
          }, 0.6)
          .to(faqImgs[1], {
            left: -1.5 * vw,
            rotation: -6.6,
            duration: 1.2,
            ease: "power2.inOut",
          }, 0)
          .to(faqImgs[1], {
            y: 1.5 * vw,
            duration: 0.6,
            ease: "power2.out",
          }, 0)
          .to(faqImgs[1], {
            y: 0,
            duration: 0.6,
            ease: "power2.in",
          }, 0.6);
      }

      // Work Info: pin section, scale wrapper from 5 → 1 over 120vh of scroll
      const workInfo = document.querySelector<HTMLElement>("section.work-info");
      const workInfoWrapper = workInfo?.querySelector<HTMLElement>(".wrapper");
      if (workInfo && workInfoWrapper) {
        gsap.fromTo(workInfoWrapper,
          { scale: 5, transformOrigin: "left top" },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: workInfo,
              start: "top top",
              end: "+=120%",
              pin: true,
              scrub: true,
              anticipatePin: 1,
            },
          }
        );
      }

      // Parallax on footer mobius image
      const footerImage = document.querySelector<HTMLElement>(".site-footer .footer-image");
      const siteFooter = document.querySelector<HTMLElement>(".site-footer");
      if (footerImage && siteFooter) {
        gsap.fromTo(footerImage,
          { y: -60 },
          {
            y: 60,
            ease: "none",
            scrollTrigger: {
              trigger: siteFooter,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // Parallax on services left image
      const servicesImage = document.querySelector<HTMLElement>("section.hp-services .left img");
      const servicesSection = document.querySelector<HTMLElement>("section.hp-services");
      if (servicesImage && servicesSection) {
        gsap.fromTo(servicesImage,
          { y: -60 },
          {
            y: 60,
            ease: "none",
            scrollTrigger: {
              trigger: servicesSection,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // ---- Page fold entrance for sections ----
      const foldSections = document.querySelectorAll<HTMLElement>("section.hp-services, section.our-team");
      foldSections.forEach((section) => {
        gsap.fromTo(section,
          {
            transformOrigin: "center bottom",
            rotationX: 2,
            scale: 0.99,
            transformPerspective: 1200,
          },
          {
            rotationX: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "top 20%",
              scrub: 1,
            },
          }
        );
      });
      });
    }, 500);

    return () => {
      clearTimeout(maskUpTimeout);
      window.removeEventListener("preloader-done", startAnimations);
      // Restore original innerHTML (preserves nested elements like .cursive)
      originalHtmlByElement.forEach((html, el) => {
        el.innerHTML = html;
      });
      // Unwrap mask-up wrappers
      maskUpWrappers.forEach((wrapper) => {
        const child = wrapper.firstChild;
        if (child && wrapper.parentNode) {
          wrapper.parentNode.insertBefore(child, wrapper);
          wrapper.remove();
        }
      });
      // Kill all GSAP tweens + ScrollTriggers created in this mount
      ctx.revert();
    };
  }, []);

  return null;
}
