import Image from "next/image";
import SplitTextReveal from "@/components/SplitTextReveal";
import TeamList from "@/components/TeamList";
import { getClient } from "@/lib/graphql-client";
import { GET_TEAM_MEMBERS } from "@/lib/queries/team";
import { GET_ABOUT_PAGE } from "@/lib/queries/about";
import { AboutContentFields, TeamMember } from "@/types/wordpress";
import type { Metadata } from "next";
import { getPageSeo, buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("about");
  return buildMetadata(seo, { path: "/about", fallbackTitle: "About" });
}

export default async function About() {
  const client = getClient();
  const [{ teamMembers }, { page }] = await Promise.all([
    client.request<{ teamMembers: { nodes: TeamMember[] } }>(GET_TEAM_MEMBERS),
    client.request<{ page: { aboutContent: AboutContentFields | null } | null }>(
      GET_ABOUT_PAGE
    ),
  ]);
  const members = teamMembers?.nodes || [];
  const about = page?.aboutContent ?? null;
  const bannerImg = about?.bannerImage?.node;
  const cultureImg = about?.cultureImage?.node;
  const slidingCards = about?.slidingCards || [];
  const cultureParagraphs = about?.cultureParagraphs || [];

  return (
    <main>
      <SplitTextReveal />
      <section className="parallax-banner">
        <div className="parallax-container">
          {bannerImg && (
            <Image
              src={bannerImg.sourceUrl}
              alt={bannerImg.altText || ""}
              width={1600}
              height={1100}
              sizes="100vw"
              loading="eager"
            />
          )}
        </div>

        <div className="content">
          {about?.bannerSubhead && (
            <h5 className="subhead">{about.bannerSubhead}</h5>
          )}
          {about?.bannerTitle && (
            <h1
              className="h1 dark"
              dangerouslySetInnerHTML={{ __html: about.bannerTitle }}
            />
          )}
        </div>
      </section>

      <section className="orange-section about-us">
        <div className="wrapper">
          {about?.introSubhead && (
            <h5 className="subhead">{about.introSubhead}</h5>
          )}
          <div className="top-content">
            {about?.introHeading && (
              <h3 className="h3" data-mask-up>
                {about.introHeading}
              </h3>
            )}

            {about?.introBody && (
              <h5 className="h5" data-mask-up>
                {about.introBody}
              </h5>
            )}
          </div>

          {slidingCards.length > 0 && (
            <div className="sliding-cards-wrapper">
              {slidingCards.map((card, i) => {
                const img = card.image?.node;
                return (
                  img && (
                    <Image
                      key={i}
                      src={img.sourceUrl}
                      alt={img.altText || ""}
                      width={800}
                      height={1035}
                      sizes="(max-width: 768px) 60vw, 27vw"
                    />
                  )
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="about-our-team">
        <div className="wrapper">
          <div className="top">
            {about?.teamSubhead && (
              <h5 className="subhead">{about.teamSubhead}</h5>
            )}
            {about?.teamTitle && (
              <h1
                className="h1 orange"
                data-split-text="scroll"
                dangerouslySetInnerHTML={{ __html: about.teamTitle }}
              />
            )}
          </div>

          <div className="bottom">
            <TeamList members={members} />
          </div>
        </div>
      </section>

      <section className="our-culture orange-section">
        <div className="wrapper">
          <div className="left">
            <div className="parallax-container">
              {cultureImg && (
                <Image
                  src={cultureImg.sourceUrl}
                  alt={cultureImg.altText || ""}
                  width={1200}
                  height={1400}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
            </div>
          </div>

          <div className="right">
            {about?.cultureSubhead && (
              <h5 className="subhead">{about.cultureSubhead}</h5>
            )}

            <div className="content-wrapper">
              {about?.cultureHeading && (
                <h3
                  className="h3"
                  dangerouslySetInnerHTML={{ __html: about.cultureHeading }}
                />
              )}

              {cultureParagraphs.length > 0 && (
                <div className="bottom-body">
                  {cultureParagraphs.map(
                    (p, i) =>
                      p.text && (
                        <p key={i} className="h5" data-mask-up>
                          {p.text}
                        </p>
                      )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
