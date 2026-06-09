import { gql } from "graphql-request";
import type { Metadata } from "next";
import { getClient } from "./graphql-client";

// The public frontend origin (NOT the WordPress backend). Used for canonicals,
// Open Graph URLs and the sitemap. Override per-environment via env.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://mobiuzstudio.com"
).replace(/\/$/, "");

export const SITE_NAME = "Mobiuz";

// The Next.js frontend owns its own indexability — NOT RankMath/WordPress.
// This keeps WordPress's "Discourage search engines" setting (which should stay
// ON so the WP backend domain isn't indexed) from de-indexing this frontend.
// Set NEXT_PUBLIC_SITE_INDEXABLE=false to hide the frontend (e.g. pre-launch).
export const SITE_INDEXABLE =
  process.env.NEXT_PUBLIC_SITE_INDEXABLE !== "false";

// Fallback share image. Replace with a dedicated 1200x630 image when available.
export const DEFAULT_OG_IMAGE = "/media/wp-content/uploads/2026/04/Vector.png";

export interface RankMathSeo {
  title: string | null;
  description: string | null;
  robots: string[] | null;
  openGraph: {
    title: string | null;
    description: string | null;
  } | null;
}

// Only fields confirmed in the WPGraphQL for Rank Math schema. Note: Rank Math's
// own `canonicalUrl` / jsonLd point at the WordPress domain, so we deliberately
// don't use them — canonicals/OG URLs are built from SITE_URL instead.
const SEO_SELECTION = `
  seo {
    title
    description
    robots
    openGraph {
      title
      description
    }
  }
`;

const PAGE_SEO_QUERY = gql`
  query PageSeo($id: ID!) {
    page(id: $id, idType: URI) {
      ${SEO_SELECTION}
    }
  }
`;

const POST_SEO_QUERY = gql`
  query PostSeo($id: ID!) {
    post(id: $id, idType: SLUG) {
      featuredImage {
        node {
          sourceUrl
        }
      }
      ${SEO_SELECTION}
    }
  }
`;

export async function getPageSeo(uri: string): Promise<RankMathSeo | null> {
  try {
    const { page } = await getClient().request<{
      page: { seo: RankMathSeo | null } | null;
    }>(PAGE_SEO_QUERY, { id: uri });
    return page?.seo ?? null;
  } catch {
    // Rank Math / WPGraphQL bridge not active yet, or field mismatch — fall back.
    return null;
  }
}

export interface PostSeoResult {
  seo: RankMathSeo | null;
  imageUrl: string | null;
}

export async function getPostSeo(slug: string): Promise<PostSeoResult> {
  const safeDecode = (s: string) => {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  };
  // WP stores non-ASCII slugs URL-encoded; try the common variants (mirrors the page resolver).
  const variants = Array.from(
    new Set([slug, slug.toLowerCase(), encodeURIComponent(safeDecode(slug)).toLowerCase()])
  );

  for (const variant of variants) {
    try {
      const { post } = await getClient().request<{
        post:
          | { seo: RankMathSeo | null; featuredImage: { node: { sourceUrl: string } | null } | null }
          | null;
      }>(POST_SEO_QUERY, { id: variant });
      if (post?.seo) {
        return { seo: post.seo, imageUrl: post.featuredImage?.node?.sourceUrl ?? null };
      }
    } catch {
      // try next variant
    }
  }
  return { seo: null, imageUrl: null };
}

export function buildMetadata(
  seo: RankMathSeo | null,
  opts: {
    path: string;
    fallbackTitle: string;
    fallbackDescription?: string;
    type?: "website" | "article";
    images?: (string | null | undefined)[];
  }
): Metadata {
  const title = seo?.title?.trim();
  const description = seo?.description?.trim() || opts.fallbackDescription;
  const ogTitle = seo?.openGraph?.title?.trim() || title || opts.fallbackTitle;
  const ogDescription = seo?.openGraph?.description?.trim() || description;
  const images = (opts.images?.filter(Boolean) as string[] | undefined)?.length
    ? (opts.images!.filter(Boolean) as string[])
    : [DEFAULT_OG_IMAGE];

  return {
    // Rank Math titles already include the site-name template, so set them absolute
    // to avoid the layout template adding a second "— Mobiuz".
    title: title ? { absolute: title } : opts.fallbackTitle,
    description,
    alternates: { canonical: opts.path },
    robots: { index: SITE_INDEXABLE, follow: SITE_INDEXABLE },
    openGraph: {
      title: ogTitle,
      description: ogDescription ?? undefined,
      url: opts.path,
      siteName: SITE_NAME,
      type: opts.type ?? "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription ?? undefined,
      images,
    },
  };
}
