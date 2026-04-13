import Link from "next/link";
import { Post } from "@/types/wordpress";

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/blog/${post.slug}`}>
            <h2>{post.title}</h2>
            {post.excerpt && (
              <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
