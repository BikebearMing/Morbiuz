"use client";

import { Fragment, useState } from "react";
import TransitionLink from "./TransitionLink";

type WorkItem = {
  title: string;
  href: string | null;
  image: { sourceUrl: string; altText: string } | null;
};

export default function WorksList({ items }: { items: WorkItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!items.length) return null;

  return (
    <div className="works-stage">
      <div className="works-list">
        <div className="works-line" />
        {items.map((item, i) => {
          const num = String(i + 1).padStart(2, "0");
          const isActive = i === activeIndex;
          const rowInner = (
            <>
              <span className="works-num">[ {num} ]</span>
              <h3 className="works-title" data-mask-up>{item.title}</h3>
            </>
          );
          return (
            <Fragment key={i}>
              <div
                className={`works-row ${isActive ? "active" : ""}`}
                onMouseEnter={() => setActiveIndex(i)}
              >
                {item.href ? (
                  <TransitionLink href={item.href} className="works-row-link">
                    {rowInner}
                  </TransitionLink>
                ) : (
                  rowInner
                )}
              </div>
              <div className="works-line" />
            </Fragment>
          );
        })}
      </div>

      <div className="works-preview">
        {items.map((item, i) => {
          const img = item.image;
          if (!img) return null;
          const imgEl = <img src={img.sourceUrl} alt={img.altText || ""} />;
          return (
            <div
              key={i}
              className={`works-image ${i === activeIndex ? "active" : ""}`}
            >
              {item.href ? (
                <TransitionLink href={item.href}>{imgEl}</TransitionLink>
              ) : (
                imgEl
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
