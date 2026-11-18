import ImageBannerHero from "@/components/ImageBannerHero";
import ImageMasonry from "@/components/ImageMasonry";
import NextProject, { NextProjectItem } from "@/components/NextProject";
import VideoCarousel from "@/components/VideoCarousel";
import VideoHero from "@/components/VideoHero";
import WorkOverview from "@/components/WorkOverview";
import WorkStory from "@/components/WorkStory";
import { getClient } from "@/lib/graphql-client";
import { GET_ALL_POSTS, GET_POST_BY_SLUG } from "@/lib/queries/posts";
import { getVideoPoster } from "@/lib/video-poster";
import { getWorkCategory, type WorkCategory } from "@/lib/work-categories";
import { Post } from "@/types/wordpress";
import { GraphQLClient } from "graphql-request";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostSeo, buildMetadata } from "@/lib/seo";

// Shared by every work type's /<category>/[slug] route — they all use the same
// layout and the same ACF fields (`videoProductionPostGroup`).

export async function generateWorkMetadata(
  category: WorkCategory,
  slug: string
): Promise<Metadata> {
  const { seo, imageUrl } = await getPostSeo(slug);
  return buildMetadata(seo, {
    path: `/${category}/${slug}`,
    fallbackTitle: decodeURIComponent(slug),
    type: "article",
    images: [imageUrl],
  });
}

export async function generateWorkStaticParams(category: WorkCategory) {
  const client = getClient();
  const { posts } = await client.request<{ posts: { nodes: Post[] } }>(
    GET_ALL_POSTS
  );

  return posts.nodes
    .filter((p) => getWorkCategory(p) === category)
    .map((p) => ({ slug: p.slug }));
}

export default async function WorkPostPage({
  category,
  slug,
}: {
  category: WorkCategory;
  slug: string;
}) {
  const client = getClient();
  const post = await resolvePost(client, slug);

  // A work only lives under its own category's URL.
  if (!post || getWorkCategory(post) !== category) notFound();

  const acf = post.videoProductionPostGroup;
  const featured = post.featuredImage?.node || null;
  const videos = (acf?.videoList || []).flatMap((v) =>
    v?.videoUrl?.trim()
      ? [{ videoUrl: v.videoUrl.trim(), videoLabel: v.videoLabel || null }]
      : []
  );
  const videoUrl = acf?.videoLink?.url || videos[0]?.videoUrl || null;
  // Social-media works with a video list get the portrait carousel layout
  // (overview + story beside the videos) instead of the landscape hero.
  const social = category === "social-media" && videos.length > 0;
  const heroImage = social
    ? null
    : featured ?? (await getPosterAsImage(videoUrl, post.title));

  const { posts: allPosts } = await client.request<{
    posts: { nodes: Post[] };
  }>(GET_ALL_POSTS);
  const categoryPosts = allPosts.nodes.filter(
    (p) => getWorkCategory(p) === category
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

      {social ? (
        <section className="work-social">
          <VideoCarousel videos={videos} title={post.title} />
          <div className="work-social-text">
            {acf?.overviewText && (
              <div className="work-social-overview">
                <h5 className="subhead">
                  <span className="bracket">[</span>
                  <span className="subhead-text">OVERVIEW</span>
                  <span className="bracket">]</span>
                </h5>
                <h2 className="h3 overview-text">{acf.overviewText}</h2>
              </div>
            )}
            <WorkStory text={acf?.storyText} />
          </div>
        </section>
      ) : (
        <VideoHero
          image={heroImage}
          videoUrl={videoUrl}
          title={post.title}
          videos={videos}
        />
      )}

      <WorkOverview
        overviewText={social ? null : acf?.overviewText || null}
        images={acf?.imageGallery?.nodes || []}
      />

      <ImageMasonry images={acf?.imageMasonry?.nodes || []} />

      <ImageBannerHero image={acf?.imageBannerHero?.node || null} />

      {!social && <WorkStory text={acf?.storyText} />}

      <NextProject items={nextItems} basePath={`/${category}`} />
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
