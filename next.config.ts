import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
      "style-src 'self' 'unsafe-inline' https:",
      // Media is proxied same-origin via /media/*, so 'self' covers it.
      // The CMS host is intentionally omitted here so it isn't re-exposed in the header.
      "img-src 'self' data: blob: https:",
      // Streamed/direct videos (e.g. streamable.com, WP-hosted mp4s).
      "media-src 'self' blob: data: https:",
      "font-src 'self' data: https:",
      "connect-src 'self' https:",
      // Video embeds rendered in iframes (YouTube / Vimeo players).
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,

  async rewrites() {
    return [
      {
        // Proxy CMS media through our own domain: /media/* -> WordPress origin
        source: "/media/:path*",
        destination: "https://morbiuz.mydemobb.com/:path*",
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
