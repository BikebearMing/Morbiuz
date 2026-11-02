// Each work type is a WordPress post category with its own listing page
// (/video-production) and work pages (/video-production/<slug>). The category
// slug in WordPress must match the key here.
export const WORK_CATEGORIES = {
  "video-production": "Video Production",
  "brand-design": "Brand Design",
  "social-media": "Social Media",
  "experimental-content": "Experimental Content",
} as const;

export type WorkCategory = keyof typeof WORK_CATEGORIES;

type CategorisedPost = {
  slug?: string | null;
  categories?: { nodes?: { slug?: string | null }[] | null } | null;
};

export function getWorkCategory(post: CategorisedPost): WorkCategory | null {
  const slugs = post.categories?.nodes?.map((c) => c.slug) ?? [];
  return (Object.keys(WORK_CATEGORIES) as WorkCategory[]).find((c) => slugs.includes(c)) ?? null;
}

// Link to a work's page, based on its own category — so a work listed on any
// page always points to where it actually lives.
export function getWorkPath(post: CategorisedPost): string | null {
  const category = getWorkCategory(post);
  return category && post.slug ? `/${category}/${post.slug}` : null;
}
