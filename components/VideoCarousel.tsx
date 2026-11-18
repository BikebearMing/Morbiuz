"use client";

import { useState } from "react";
import { isDirectFile, toEmbedUrl } from "@/components/VideoHero";

type Props = {
  videos: { videoUrl: string; videoLabel: string | null }[];
  title: string;
};

// Portrait (9:16) player for social-media works. Loops endlessly with the
// arrows; only the active video is mounted, so only one player ever loads.
export default function VideoCarousel({ videos, title }: Props) {
  const [index, setIndex] = useState(0);
  const count = videos.length;

  const { videoUrl, videoLabel } = videos[index];
  const label = videoLabel || `${title} – video ${index + 1} of ${count}`;
  const step = (d: number) => setIndex((i) => (i + d + count) % count);

  const arrow = (dir: -1 | 1) =>
    count > 1 && (
      <button
        type="button"
        className="video-carousel-arrow"
        aria-label={dir < 0 ? "Previous video" : "Next video"}
        onClick={() => step(dir)}
      >
        <svg viewBox="0 0 12 24" aria-hidden>
          <polyline
            points={dir < 0 ? "10,2 2,12 10,22" : "2,2 10,12 2,22"}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </button>
    );

  return (
    <div className="video-carousel" aria-label={`${title} videos`} role="group">
      {arrow(-1)}
      <div className="video-carousel-frame">
        {isDirectFile(videoUrl) ? (
          <video
            key={index}
            src={videoUrl}
            controls
            playsInline
            preload="metadata"
            title={label}
          />
        ) : (
          <iframe
            key={index}
            src={toEmbedUrl(videoUrl, false)}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            title={label}
          />
        )}
      </div>
      {arrow(1)}
    </div>
  );
}
