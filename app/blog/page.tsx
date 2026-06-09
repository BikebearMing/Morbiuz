import { getClient } from "@/lib/graphql-client";
import { GET_ALL_POSTS } from "@/lib/queries/posts";
import { Post } from "@/types/wordpress";
import { PostList } from "@/components/PostList";
import type { Metadata } from "next";
import { getPageSeo, buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("blog");
  return buildMetadata(seo, {
    path: "/blog",
    fallbackTitle: "Blog",
    fallbackDescription: "News, thoughts and work from Mobiuz.",
  });
}

export default async function BlogPage() {
  const client = getClient();
  const { posts } = await client.request<{ posts: { nodes: Post[] } }>(
    GET_ALL_POSTS
  );

  return (
    <main>
      <h1>Blog</h1>
      <PostList posts={posts.nodes} />
    </main>
  );
}
