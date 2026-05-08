import SplitTextReveal from "@/components/SplitTextReveal";
import WorksList from "@/components/WorksList";
import { getClient } from "@/lib/graphql-client";
import { GET_VIDEO_PRODUCTION_PAGE } from "@/lib/queries/video-production";
import { notFound } from "next/navigation";

export const revalidate = 60;

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
    workLink: { nodes: { uri: string | null }[] } | null;
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

type VideoProductionPage = {
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

export default async function VideoProduction() {
  const client = getClient();
  const { page } = await client.request<{ page: VideoProductionPage | null }>(
    GET_VIDEO_PRODUCTION_PAGE
  );

  if (!page) notFound();

  const banner = page.workPages?.workTopBanner;
  const bannerImg = banner?.bannerImage?.node;
  const info = page.workPages?.orangeSectionInfo;
  const pillars = info?.infoPillarWrapper?.infoPillarRepeater || [];
  const ourWorks = page.workPages?.ourWorks;
  const workRows = ourWorks?.worksWrapper?.ourWorkRepeater || [];
  const toRelativeHref = (raw: string | null | undefined) => {
    if (!raw) return null;
    try {
      const u = new URL(raw, "http://x");
      return u.pathname + u.search;
    } catch {
      return raw.startsWith("/") ? raw : null;
    }
  };

  const workItems = workRows
    .map((r) => ({
      title: r.workGroup?.workTitle || "",
      href: toRelativeHref(r.workGroup?.workLink?.nodes?.[0]?.uri),
      image: r.workGroup?.workImage?.node || null,
    }))
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
                      <h5 className="work-info-num">[ {num} ]</h5>
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
                          <p className="work-info-subtext">{child.infoSubtext}</p>
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
              <h2 className="orange our-works-title h1">
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
