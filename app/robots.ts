import type { MetadataRoute } from "next";
import { SITE_URL, SITE_INDEXABLE } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (!SITE_INDEXABLE) {
    // Pre-launch / hidden: block all crawlers.
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
