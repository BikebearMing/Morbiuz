import WorkPostPage, {
  generateWorkMetadata,
  generateWorkStaticParams,
} from "@/components/WorkPostPage";
import type { Metadata } from "next";

const CATEGORY = "video-production";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return generateWorkMetadata(CATEGORY, slug);
}

export function generateStaticParams() {
  return generateWorkStaticParams(CATEGORY);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <WorkPostPage category={CATEGORY} slug={slug} />;
}
