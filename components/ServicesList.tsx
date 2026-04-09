"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import type { ServiceItem } from "@/types/wordpress";

export default function ServicesList({ items }: { items: ServiceItem[] }) {
  const [active, setActive] = useState(0);
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const prevActive = useRef(0);

  useEffect(() => {
    if (prevActive.current === active) return;
    prevActive.current = active;

    const imgContainer = imgContainerRef.current;
    const textEl = textRef.current;
    const current = items[active]?.serviceGroup;
    if (!imgContainer || !textEl || !current) return;

    // --- Animate out old text lines first ---
    const oldLines = textEl.querySelectorAll("span");
    const currentImg = imgContainer.querySelector("img");

    // Exit: old lines slide up and out
    gsap.to(oldLines, {
      yPercent: -100,
      duration: 0.35,
      ease: "power2.in",
      stagger: 0.04,
      onComplete: () => {
        // --- Build new text lines ---
        textEl.textContent = current.subtext;

        const words = current.subtext.split(" ");
        textEl.innerHTML = words.map((w) => `<span>${w}</span>`).join(" ");
        const wordSpans = textEl.querySelectorAll("span");

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

        textEl.innerHTML = "";
        lineGroups.forEach((lineWords) => {
          const clip = document.createElement("div");
          clip.style.overflow = "hidden";
          const span = document.createElement("span");
          span.style.display = "block";
          span.textContent = lineWords.join(" ");
          clip.appendChild(span);
          textEl.appendChild(clip);
        });

        // Enter: new lines slide up from below
        const newLines = textEl.querySelectorAll("span");
        gsap.fromTo(
          newLines,
          { yPercent: 100 },
          { yPercent: 0, duration: 0.45, ease: "power3.out", stagger: 0.06 }
        );
      },
    });

    // --- Image crossfade with mask ---
    const newImg = document.createElement("img");
    newImg.src = current.serviceImage?.node?.sourceUrl || "";
    newImg.alt = current.serviceImage?.node?.altText || "";
    newImg.style.position = "absolute";
    newImg.style.inset = "0";
    newImg.style.width = "100%";
    newImg.style.height = "100%";
    newImg.style.objectFit = "cover";
    imgContainer.appendChild(newImg);

    gsap.fromTo(
      newImg,
      { clipPath: "inset(100% 0 0 0)" },
      {
        clipPath: "inset(0% 0 0 0)",
        duration: 0.7,
        ease: "power2.inOut",
        onComplete: () => {
          if (currentImg && currentImg !== newImg) {
            currentImg.remove();
          }
        },
      }
    );
  }, [active, items]);

  const firstItem = items[0]?.serviceGroup;

  return (
    <div className="right">
      <div className="service-titles">
        {items.map((item, i) => (
          <h2
            key={i}
            className={`service-title dark cursive ${i === active ? "active" : ""}`}
            onMouseEnter={() => setActive(i)}
          >
            {item.serviceGroup.title}
          </h2>
        ))}
      </div>

      <div className="service-detail">
        <div className="service-img-clip" ref={imgContainerRef}>
          {firstItem?.serviceImage?.node && (
            <img
              src={firstItem.serviceImage.node.sourceUrl}
              alt={firstItem.serviceImage.node.altText || ""}
            />
          )}
        </div>
        <div className="service-text-clip">
          <p className="body" ref={textRef}>
            {firstItem?.subtext}
          </p>
        </div>
      </div>
    </div>
  );
}
