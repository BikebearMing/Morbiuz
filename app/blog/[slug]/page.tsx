import { getClient } from "@/lib/graphql-client";
import { GET_ALL_POSTS, GET_POST_BY_SLUG } from "@/lib/queries/posts";
import { Post } from "@/types/wordpress";
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
    path: `/blog/${slug}`,
    fallbackTitle: slug,
    type: "article",
    images: [imageUrl],
  });
}

export async function generateStaticParams() {
  const client = getClient();
  const { posts } = await client.request<{ posts: { nodes: Post[] } }>(
    GET_ALL_POSTS
  );

  return posts.nodes.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = getClient();
  const { post } = await client.request<{ post: Post | null }>(
    GET_POST_BY_SLUG,
    { slug }
  );

  if (!post) {
    notFound();
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <time>{new Date(post.date).toLocaleDateString()}</time>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
