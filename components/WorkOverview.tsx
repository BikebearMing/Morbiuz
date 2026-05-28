"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Image = { sourceUrl: string; altText: string };

type Props = {
  overviewText: string | null;
  images: Image[];
};

export default function WorkOverview({ overviewText, images }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const track = section.querySelector(".overview-track") as HTMLElement | null;
    if (!track) return;
    const innerImages = section.querySelectorAll<HTMLElement>(
      ".overview-image-inner"
    );

    let ctx: gsap.Context | null = null;

    function setup() {
      if (ctx) ctx.revert();

      ctx = gsap.context(() => {
        if (!track) return;
        if (window.matchMedia("(max-width: 768px)").matches) return;

        const distance = () => track.scrollWidth - window.innerWidth;
        const initial = distance();
        if (initial <= 0) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "bottom bottom",
            end: () => `+=${distance()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          track,
          {
            x: () => -distance(),
            ease: "none",
          },
          0
        );

        innerImages.forEach((img, i) => {
          const offset = (i % 2 === 0 ? -1 : 1) * 3.5;
          tl.fromTo(
            img,
            { xPercent: -offset },
            { xPercent: offset, ease: "power1.inOut" },
            0
          );
        });
      }, section!);
    }

    setup();

    return () => {
      if (ctx) ctx.revert();
    };
  }, [images.length]);

  if (!overviewText && images.length === 0) return null;

  return (
    <section className="work-overview" ref={sectionRef}>
      <div className="wrapper">
        <h5 className="subhead">
          <span className="bracket">[</span>
          <span className="subhead-text">OVERVIEW</span>
          <span className="bracket">]</span>
        </h5>
        {overviewText && (
          <h2 className="h3 overview-text">{overviewText}</h2>
        )}
      </div>

      {images.length > 0 && (
        <div className="overview-track-viewport">
          <div className="overview-track">
            {images.map((img, i) => (
              <div key={i} className="overview-image">
                <div className="overview-image-inner">
                  <img src={img.sourceUrl} alt={img.altText || ""} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
