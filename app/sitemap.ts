import type { MetadataRoute } from "next";
import { getClient } from "@/lib/graphql-client";
import { GET_ALL_POSTS } from "@/lib/queries/posts";
import { SITE_URL } from "@/lib/seo";
import type { Post } from "@/types/wordpress";

export const revalidate = 3600;

const STATIC_ROUTES = [
  "",
  "/about",
  "/contact",
  "/video-production",
  "/brand-design",
  "/social-media",
  "/experimental-content",
  "/blog",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  try {
    const { posts } = await getClient().request<{ posts: { nodes: Post[] } }>(
      GET_ALL_POSTS
    );
    for (const post of posts.nodes) {
      const lastModified = post.date ? new Date(post.date) : new Date();
      entries.push({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.6,
      });
      if (post.categories?.nodes?.some((c) => c.slug === "video-production")) {
        entries.push({
          url: `${SITE_URL}/video-production/${post.slug}`,
          lastModified,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  } catch {
    // WordPress unreachable — return the static routes so the sitemap still builds.
  }

  return entries;
}
