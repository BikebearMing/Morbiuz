import SplitTextReveal from "@/components/SplitTextReveal";
import WorksList from "@/components/WorksList";
import { getClient } from "@/lib/graphql-client";
import { GET_SOCIAL_MEDIA_PAGE } from "@/lib/queries/social-media";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageSeo, buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("social-media");
  return buildMetadata(seo, {
    path: "/social-media",
    fallbackTitle: "Social Media",
  });
}

type AcfImage = { node: { sourceUrl: string; altText: string } } | null;

type WorkBanner = {
  bannerSubhead: string | null;
  bannerTitle: string | null;
  bannerImage: AcfImage;
};

type InfoPillar = {
  infoChild: {
    infoTitle: string | null;
    infoSubtext: string | null;
    infoImage: AcfImage;
  } | null;
};

type OrangeSectionInfo = {
  heading: string | null;
  infoPillarWrapper: {
    infoPillarRepeater: InfoPillar[] | null;
  } | null;
} | null;

type WorkRow = {
  workGroup: {
    workTitle: string | null;
    workLink: { nodes: { slug: string | null }[] } | null;
    workImage: AcfImage;
  } | null;
};

type OurWorks = {
  ourWorkSubheader: string | null;
  ourWorkTitle: string | null;
  worksWrapper: {
    ourWorkRepeater: WorkRow[] | null;
  } | null;
} | null;

type SocialMediaPage = {
  title: string;
  content: string | null;
  workPages: {
    workTopBanner: WorkBanner | null;
    orangeSectionInfo: OrangeSectionInfo;
    ourWorks: OurWorks;
  } | null;
};

function renderTitleWithLastWord(title: string) {
  const trimmed = title.trim();
  if (!trimmed) return null;
  const parts = trimmed.split(/\s+/);
  const last = parts.pop()!;
  const lead = parts.join(" ");
  return (
    <>
      {lead && <>{lead} </>}
      <span className="cursive has-underline">{last.toLowerCase()}</span>
    </>
  );
}

export default async function SocialMedia() {
  const client = getClient();
  const { page } = await client.request<{ page: SocialMediaPage | null }>(
    GET_SOCIAL_MEDIA_PAGE
  );

  if (!page) notFound();

  const banner = page.workPages?.workTopBanner;
  const bannerImg = banner?.bannerImage?.node;
  const info = page.workPages?.orangeSectionInfo;
  const pillars = info?.infoPillarWrapper?.infoPillarRepeater || [];
  const ourWorks = page.workPages?.ourWorks;
  const workRows = ourWorks?.worksWrapper?.ourWorkRepeater || [];

  const workItems = workRows
    .map((r) => {
      const slug = r.workGroup?.workLink?.nodes?.[0]?.slug || null;
      return {
        title: r.workGroup?.workTitle || "",
        href: slug ? `/social-media/${slug}` : null,
        image: r.workGroup?.workImage?.node || null,
      };
    })
    .filter((w) => w.title);

  return (
    <main>
      <SplitTextReveal />
      <section className="parallax-banner tall">
        <div className="parallax-container">
          {bannerImg && (
            <img src={bannerImg.sourceUrl} alt={bannerImg.altText || ""} />
          )}
        </div>
        <div className="content">
          {banner?.bannerSubhead && (
            <h5 className="subhead">
              <span className="bracket">[</span>
              <span className="subhead-text">{banner.bannerSubhead}</span>
              <span className="bracket">]</span>
            </h5>
          )}
          {banner?.bannerTitle && (
            <h1 className="h1 dark">
              {renderTitleWithLastWord(banner.bannerTitle)}
            </h1>
          )}
        </div>
      </section>

      {(info?.heading || pillars.length > 0) && (
        <section className="work-info orange-section">
          <div className="wrapper">
            {info?.heading && (
              <h2 className="work-info-heading h3">{info.heading}</h2>
            )}

            {pillars.length > 0 && (
              <div className="work-info-pillars">
                {pillars.map((p, i) => {
                  const num = String(i + 1).padStart(2, "0");
                  const child = p.infoChild;
                  const img = child?.infoImage?.node;
                  return (
                    <div key={i} className="work-info-pillar">
                      <h5 className="subhead">[ {num} ]</h5>
                      {child?.infoTitle && (
                        <h3 className="work-info-title h3">{child.infoTitle}</h3>
                      )}
                      <div className="work-info-body">
                        {img && (
                          <div className="work-info-image">
                            <img
                              src={img.sourceUrl}
                              alt={img.altText || ""}
                            />
                          </div>
                        )}
                        {child?.infoSubtext && (
                          <p className="work-info-subtext subhead">{child.infoSubtext}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {(ourWorks?.ourWorkTitle || workItems.length > 0) && (
        <section className="our-works">
          <div className="wrapper">
            {ourWorks?.ourWorkSubheader && (
              <h5 className="subhead">
                <span className="bracket">[</span>
                <span className="subhead-text">{ourWorks.ourWorkSubheader}</span>
                <span className="bracket">]</span>
              </h5>
            )}
            {ourWorks?.ourWorkTitle && (
              <h2 className="orange our-works-title h1" data-split-text="scroll">
                {ourWorks.ourWorkTitle}
              </h2>
            )}
            {workItems.length > 0 && <WorksList items={workItems} />}
          </div>
        </section>
      )}
    </main>
  );
}
