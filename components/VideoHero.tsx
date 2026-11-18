"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  image: { sourceUrl: string; altText: string } | null;
  videoUrl: string | null;
  title: string;
  // Two or more: a row of buttons under the hero switches what it plays.
  videos?: { videoUrl: string; videoLabel: string | null }[];
};

export function toEmbedUrl(url: string, autoplay = true): string {
  const ap = autoplay ? 1 : 0;
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  // Playlist links (`list=`): keep the playlist so the player can step
  // through the episodes. A bare /playlist?list= link has no video ID.
  const list = /youtube\.com|youtu\.be/.test(url)
    ? url.match(/[?&]list=([\w-]+)/)?.[1]
    : undefined;
  if (yt || list) {
    const path = yt ? `/${yt[1]}` : "";
    const playlist = list ? `listType=playlist&list=${list}&` : "";
    return `https://www.youtube.com/embed${path}?${playlist}autoplay=${ap}`;
  }
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=${ap}`;
  // https://developers.tiktok.com/doc/embed-player
  const tt = url.match(/tiktok\.com\/(?:@[\w.-]+\/video|embed(?:\/v2)?|player\/v1)\/(\d+)/);
  if (tt) return `https://www.tiktok.com/player/v1/${tt[1]}?autoplay=${ap}`;
  // Same iframe Instagram's official embed.js builds from the post permalink.
  const ig = url.match(/instagram\.com\/(?:[\w.]+\/)?(p|reels?|tv)\/([\w-]+)/);
  if (ig) {
    const type = ig[1] === "reels" ? "reel" : ig[1];
    return `https://www.instagram.com/${type}/${ig[2]}/embed/`;
  }
  return url;
}

export function isDirectFile(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
}

export default function VideoHero({
  image,
  videoUrl: linkUrl,
  title,
  videos = [],
}: Props) {
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState(0);
  const switcher = videos.length > 1;
  const videoUrl = switcher ? videos[active].videoUrl : linkUrl;

  if (!image && !videoUrl) return null;

  const directFile = videoUrl ? isDirectFile(videoUrl) : false;

  return (
    <>
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
              <Image
                src={image.sourceUrl}
                alt={image.altText || title}
                className="work-hero-image"
                width={1600}
                height={900}
                sizes="100vw"
                loading="eager"
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
      {switcher && (
        <div className="work-hero-videos">
          {videos.map((v, i) => (
            <button
              key={i}
              type="button"
              className={`subhead work-hero-video${i === active ? " active" : ""}`}
              aria-pressed={i === active}
              onClick={() => {
                setActive(i);
                setPlaying(true);
              }}
            >
              <span className="bracket">[</span>
              <span className="subhead-text">{v.videoLabel || `Video ${i + 1}`}</span>
              <span className="bracket">]</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
