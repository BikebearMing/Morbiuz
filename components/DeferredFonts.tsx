"use client";

import { useEffect } from "react";

// External font stylesheets (Adobe Typekit "alga" + Google "Mona Sans") are
// render-blocking if placed in <head>. We inject them after hydration so they
// don't block first paint. font-display:swap (set on every face) keeps text
// visible in a fallback until they load, and the cold-load preloader hides the
// swap. preconnect hints in the document <head> keep the deferred fetch fast.
const FONT_STYLESHEETS = [
  "https://use.typekit.net/ekj7cky.css",
  "https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wght@0,200..900;1,200..900&display=swap",
];

export default function DeferredFonts() {
  useEffect(() => {
    for (const href of FONT_STYLESHEETS) {
      if (document.querySelector(`link[data-deferred-font="${href}"]`)) continue;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.setAttribute("data-deferred-font", href);
      document.head.appendChild(link);
    }
  }, []);

  return null;
}
