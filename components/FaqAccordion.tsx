"use client";

import { useEffect, useRef, useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

const DEFAULT_ITEMS: FaqItem[] = [
  {
    question: "Who is Mobiuz?",
    answer:
      "Lorem ipsum dolor sit amet consectetur. Amet ac in auctor elementum ullamcorper. Porttitor nullam vulputate vivamus vulputate. Tristique morbi hendrerit sed tincidunt nec ullamcorper in. Commodo at vitae quis facilisi. In vel sit mauris nec egestas convallis mattis a facilisi.",
  },
  { question: "Lorem ipsum dolor sit amet?", answer: "Lorem ipsum dolor sit amet consectetur." },
  { question: "Lorem ipsum dolor sit amet?", answer: "Lorem ipsum dolor sit amet consectetur." },
  { question: "Lorem ipsum dolor sit amet?", answer: "Lorem ipsum dolor sit amet consectetur." },
  { question: "Lorem ipsum dolor sit amet?", answer: "Lorem ipsum dolor sit amet consectetur." },
];

function splitIntoLines(p: HTMLElement, originalText: string) {
  p.textContent = "";

  const words = originalText.split(/\s+/).filter(Boolean);
  const wordSpans: HTMLSpanElement[] = [];

  words.forEach((w, i) => {
    const span = document.createElement("span");
    span.style.display = "inline-block";
    span.textContent = w;
    p.appendChild(span);
    wordSpans.push(span);
    if (i < words.length - 1) p.appendChild(document.createTextNode(" "));
  });

  const lines: HTMLSpanElement[][] = [];
  let currentLine: HTMLSpanElement[] = [];
  let currentTop: number | null = null;
  wordSpans.forEach((span) => {
    const top = span.offsetTop;
    if (currentTop === null || top === currentTop) {
      currentLine.push(span);
      currentTop = top;
    } else {
      lines.push(currentLine);
      currentLine = [span];
      currentTop = top;
    }
  });
  if (currentLine.length) lines.push(currentLine);

  p.textContent = "";
  lines.forEach((line, i) => {
    const clip = document.createElement("span");
    clip.className = "faq-line-clip";
    clip.style.setProperty("--i", String(i));
    const inner = document.createElement("span");
    inner.className = "faq-line-inner";
    inner.textContent = line.map((w) => w.textContent).join(" ");
    clip.appendChild(inner);
    p.appendChild(clip);
  });
}

export default function FaqAccordion({
  items = DEFAULT_ITEMS,
}: {
  items?: FaqItem[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const paragraphs = Array.from(
      list.querySelectorAll<HTMLElement>(".faq-answer")
    );
    const originalText = new Map<HTMLElement, string>();
    paragraphs.forEach((p) => {
      originalText.set(p, p.dataset.text || p.textContent || "");
      p.dataset.text = originalText.get(p)!;
    });

    const split = () => {
      paragraphs.forEach((p) => splitIntoLines(p, originalText.get(p) || ""));
    };

    split();
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(split);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      paragraphs.forEach((p) => {
        p.textContent = originalText.get(p) || "";
      });
    };
  }, [items]);

  return (
    <div className="faq-list" ref={listRef}>
      {items.map((item, i) => {
        const num = String(i + 1).padStart(2, "0");
        const isActive = i === activeIndex;
        return (
          <div
            key={i}
            className={`faq-row ${isActive ? "active" : ""}`}
            onClick={() => setActiveIndex(isActive ? null : i)}
          >
            <div className="faq-row-head">
              <span className="faq-num">[{num}]</span>
              <span className="faq-question h3-v2">{item.question}</span>
              <span className="faq-icon" aria-hidden="true">
                <span className="faq-icon-bar faq-icon-bar-h" />
                <span className="faq-icon-bar faq-icon-bar-v" />
              </span>
            </div>
            <div className="faq-line" />
            <div className="faq-answer-wrap" aria-hidden={!isActive}>
              <div className="faq-answer-inner">
                <p className="faq-answer">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
