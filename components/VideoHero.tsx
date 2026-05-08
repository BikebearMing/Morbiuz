"use client";

import { useState } from "react";

type Props = {
  image: { sourceUrl: string; altText: string } | null;
  videoUrl: string | null;
  title: string;
};

function toEmbedUrl(url: string): string {
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})/
  );
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1`;
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1`;
  return url;
}

function isDirectFile(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
}

export default function VideoHero({ image, videoUrl, title }: Props) {
  const [playing, setPlaying] = useState(false);

  if (!image && !videoUrl) return null;

  const directFile = videoUrl ? isDirectFile(videoUrl) : false;

  return (
    <div className="work-hero">
      {playing && videoUrl ? (
        directFile ? (
          <video
            src={videoUrl}
            controls
            autoPlay
            playsInline
            className="work-hero-player"
          />
        ) : (
          <iframe
            src={toEmbedUrl(videoUrl)}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={title}
            className="work-hero-player"
          />
        )
      ) : (
        <>
          {image ? (
            <img
              src={image.sourceUrl}
              alt={image.altText || title}
              className="work-hero-image"
            />
          ) : directFile && videoUrl ? (
            <video
              src={`${videoUrl}#t=0.1`}
              preload="metadata"
              muted
              playsInline
              className="work-hero-image"
            />
          ) : null}
          {videoUrl && (
            <button
              type="button"
              className="work-hero-play"
              aria-label="Play video"
              onClick={() => setPlaying(true)}
            >
              <span className="work-hero-play-icon" aria-hidden>
                ▶
              </span>
              <span className="work-hero-play-label">PLAY</span>
            </button>
          )}
        </>
      )}
    </div>
  );
}
