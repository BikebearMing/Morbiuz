import BehindTheScene from "@/components/BehindTheScene";
import ImageBannerHero from "@/components/ImageBannerHero";
import ImageMasonry from "@/components/ImageMasonry";
import NextProject, { NextProjectItem } from "@/components/NextProject";
import VideoHero from "@/components/VideoHero";
import WorkOverview from "@/components/WorkOverview";
import { getClient } from "@/lib/graphql-client";
import { GET_ALL_POSTS, GET_POST_BY_SLUG } from "@/lib/queries/posts";
import { getVideoPoster } from "@/lib/video-poster";
import { Post } from "@/types/wordpress";
import { GraphQLClient } from "graphql-request";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostSeo, buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { seo, imageUrl } = await getPostSeo(slug);
  return buildMetadata(seo, {
    path: `/video-production/${slug}`,
    fallbackTitle: decodeURIComponent(slug),
    type: "article",
    images: [imageUrl],
  });
}

const CATEGORY_SLUG = "video-production";

export async function generateStaticParams() {
  const client = getClient();
  const { posts } = await client.request<{ posts: { nodes: Post[] } }>(
    GET_ALL_POSTS
  );

  return posts.nodes
    .filter((p) =>
      p.categories?.nodes?.some((c) => c.slug === CATEGORY_SLUG)
    )
    .map((p) => ({ slug: p.slug }));
}

export default async function VideoProductionPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = getClient();
  const post = await resolvePost(client, slug);

  if (!post) notFound();

  const acf = post.videoProductionPostGroup;
  const videoUrl = acf?.videoLink?.url || null;
  const featured = post.featuredImage?.node || null;
  const heroImage =
    featured ?? (await getPosterAsImage(videoUrl, post.title));

  const { posts: allPosts } = await client.request<{
    posts: { nodes: Post[] };
  }>(GET_ALL_POSTS);
  const categoryPosts = allPosts.nodes.filter((p) =>
    p.categories?.nodes?.some((c) => c.slug === CATEGORY_SLUG)
  );
  const currentIdx = categoryPosts.findIndex((p) => p.slug === post.slug);
  const ordered =
    currentIdx >= 0
      ? [
          ...categoryPosts.slice(currentIdx + 1),
          ...categoryPosts.slice(0, currentIdx),
        ]
      : [];
  const nextItems: NextProjectItem[] = ordered.slice(0, 2).map((p) => ({
    title: p.title,
    slug: p.slug,
    image: p.featuredImage?.node || null,
    projectName: p.videoProductionPostGroup?.projectName || null,
    rightSideLabel: p.videoProductionPostGroup?.rightSideLabel || null,
  }));

  return (
    <main className="work-post">
      <header className="work-post-head">
        <div className="wrapper">
          <h1 className="h2-v2 orange work-post-title">{post.title}</h1>
          <div className="work-post-meta">
            <div className="subhead orange work-post-meta-left">
              {acf?.projectName && (
                <span className="work-post-project">{acf.projectName}</span>
              )}
              {acf?.projectYear && (
                <span className="work-post-year">{acf.projectYear}</span>
              )}
            </div>
            {acf?.rightSideLabel && (
              <div className="subhead orange work-post-meta-right">{acf.rightSideLabel}</div>
            )}
          </div>
        </div>
      </header>

      <VideoHero
        image={heroImage}
        videoUrl={videoUrl}
        title={post.title}
      />

      <WorkOverview
        overviewText={acf?.overviewText || null}
        images={acf?.imageGallery?.nodes || []}
      />

      <ImageMasonry images={acf?.imageMasonry?.nodes || []} />

      <ImageBannerHero image={acf?.imageBannerHero?.node || null} />

      <BehindTheScene
        credits={
          acf?.btsGroup?.btsCreditsRepeater
            ?.map((r) => r.btsCredit)
            .filter((c): c is NonNullable<typeof c> => !!c) || []
        }
      />

      <NextProject items={nextItems} />
    </main>
  );
}

async function getPosterAsImage(
  videoUrl: string | null,
  title: string
): Promise<{ sourceUrl: string; altText: string } | null> {
  const url = await getVideoPoster(videoUrl);
  return url ? { sourceUrl: url, altText: title } : null;
}

// WP stores non-ASCII slugs as lowercase URL-encoded strings (e.g. 室内高人-mv → %e5%ae%a4...mv).
// Next.js can deliver params.slug either encoded or decoded depending on runtime; try both forms.
async function resolvePost(
  client: GraphQLClient,
  slug: string
): Promise<Post | null> {
  const safeDecode = (s: string) => {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  };
  const decoded = safeDecode(slug);
  const variants = Array.from(
    new Set([
      slug.toLowerCase(),
      slug,
      encodeURIComponent(decoded).toLowerCase(),
    ])
  );

  for (const variant of variants) {
    const { post } = await client.request<{ post: Post | null }>(
      GET_POST_BY_SLUG,
      { slug: variant }
    );
    if (post) return post;
  }
  return null;
}
