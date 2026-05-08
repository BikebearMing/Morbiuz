"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TeamMember } from "@/types/wordpress";

gsap.registerPlugin(ScrollTrigger);

function renderPosition(text: string | null | undefined) {
  if (!text) return null;
  const parts = text.split(/([^A-Za-z0-9\s])/);
  return parts.map((part, i) => {
    if (!part) return null;
    if (/[^A-Za-z0-9\s]/.test(part)) {
      return (
        <span key={i} className="team-position-symbol">
          {part}
        </span>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export default function TeamList({ members }: { members: TeamMember[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll<HTMLElement>(
      ".team-row, .line"
    );
    if (!items.length) return;
    const ctx = gsap.context(() => {
      gsap.set(items, { x: -50, autoAlpha: 0 });
      gsap.to(items, {
        x: 0,
        autoAlpha: 1,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: listRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, listRef);
    return () => ctx.revert();
  }, [members]);

  if (!members.length) return null;

  return (
    <div
      className="team-list"
      ref={listRef}
      onMouseLeave={() => setActiveIndex(null)}
    >
      {members.map((m, i) => {
        const num = String(i + 1).padStart(2, "0");
        const isActive = i === activeIndex;
        const src = m.featuredImage?.node.sourceUrl;
        return (
          <Fragment key={i}>
            <div className="line" />
            <div
              className={`team-row ${isActive ? "active" : ""}`}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <div className="team-row-left">
                <span className="h5 team-num">[{num}]</span>
                <span className="team-name h3-v2">{m.title}</span>
              </div>

              {src && (
                <div className="team-row-image" aria-hidden="true">
                  <img src={src} alt="" />
                </div>
              )}

              <div className="team-row-right">
                <span className="h3 team-position">
                  {renderPosition(m.memberDetails?.position)}
                </span>
              </div>
            </div>
          </Fragment>
        );
      })}
      <div className="line" />
    </div>
  );
}
