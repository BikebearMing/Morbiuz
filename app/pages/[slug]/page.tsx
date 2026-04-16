import { getClient } from "@/lib/graphql-client";
import { GET_ALL_PAGES, GET_PAGE_BY_SLUG } from "@/lib/queries/pages";
import { Page } from "@/types/wordpress";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const client = getClient();
  const { pages } = await client.request<{ pages: { nodes: Page[] } }>(
    GET_ALL_PAGES
  );

  return pages.nodes.map((page) => ({
    slug: page.slug,
  }));
}

export default async function CmsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = getClient();
  const { page } = await client.request<{ page: Page | null }>(
    GET_PAGE_BY_SLUG,
    { slug }
  );

  if (!page) {
    notFound();
  }

  return (
    <article>
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </article>
  );
}
