import { getClient } from "@/lib/graphql-client";
import { GET_ALL_POSTS } from "@/lib/queries/posts";
import { Post } from "@/types/wordpress";
import { PostList } from "@/components/PostList";

export const revalidate = 60;

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
