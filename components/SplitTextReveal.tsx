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
    const elements = document.querySelectorAll<HTMLElement>("[data-split-text]");

    // Split immediately (so text is hidden), but don't animate yet
    const allChars: { el: HTMLElement; chars: NodeListOf<Element>; mode: string | null }[] = [];
    const cursiveEls: HTMLElement[] = [];
    elements.forEach((el) => {
      const chars = splitElement(el);
      if (chars.length) {
        gsap.set(chars, { yPercent: 100 });
        allChars.push({ el, chars, mode: el.getAttribute("data-split-text") });
      }
      // Hide cursive elements for mask-up reveal
      el.querySelectorAll<HTMLElement>(".cursive").forEach((c) => {
        gsap.set(c, { clipPath: "inset(100% 0 0 0)", display: "inline-block" });
        cursiveEls.push(c);
      });
    });

    const startAnimations = () => {
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
            onComplete: () => {
              cursiveEls.forEach((c) => {
                gsap.to(c, {
                  clipPath: "inset(0% 0 0 0)",
                  duration: 0.5,
                  ease: "power3.out",
                });
              });
            },
          });
        }
      });
    };

    window.addEventListener("preloader-done", startAnimations, { once: true });

    // ---- data-mask-up: whole-line clip reveal ----
    // Hide immediately, but defer ScrollTrigger creation until after pins are set up
    const maskUpEls = document.querySelectorAll<HTMLElement>("[data-mask-up]");
    const maskUpWrappers: HTMLElement[] = [];

    maskUpEls.forEach((el) => {
      const wrapper = document.createElement("div");
      wrapper.style.overflow = "hidden";
      el.parentNode!.insertBefore(wrapper, el);
      wrapper.appendChild(el);
      wrapper.style.height = (el.offsetHeight + 10) + "px";
      maskUpWrappers.push(wrapper);
      gsap.set(el, { y: wrapper.offsetHeight });
    });

    // Wait for all other ScrollTriggers (pins) to be created, then set up mask-up triggers + parallax
    const maskUpTimeout = setTimeout(() => {
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
    }, 500);

    return () => {
      clearTimeout(maskUpTimeout);
      window.removeEventListener("preloader-done", startAnimations);
      elements.forEach((el) => {
        const original = el.getAttribute("aria-label");
        if (original) el.textContent = original;
      });
      // Unwrap mask-up elements
      maskUpWrappers.forEach((wrapper) => {
        const child = wrapper.firstChild;
        if (child && wrapper.parentNode) {
          wrapper.parentNode.insertBefore(child, wrapper);
          wrapper.remove();
        }
      });
    };
  }, []);

  return null;
}
