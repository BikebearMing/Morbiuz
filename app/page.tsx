import Image from "next/image";
import { getClient } from "@/lib/graphql-client";
import { GET_HOME_PAGE } from "@/lib/queries/home";
import { HomePage } from "@/types/wordpress";
import HeroAnimation from "@/components/HeroAnimation";
import VideoStack from "@/components/VideoStack";
import ServicesList from "@/components/ServicesList";
import Preloader from "@/components/Preloader";
import SplitTextReveal from "@/components/SplitTextReveal";
import TransitionLink from "@/components/TransitionLink";
import type { Metadata } from "next";
import { getPageSeo, buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("home");
  return buildMetadata(seo, {
    path: "/",
    fallbackTitle: "Mobiuz",
    fallbackDescription: "Stories that influence culture",
  });
}

export default async function Home() {
  const client = getClient();
  const { page } = await client.request<{ page: HomePage }>(GET_HOME_PAGE);

  const { hero, heroImages, featuredClients, services } = page.home;
  const {
    mobiusBgImage,
    videoZoom,
    servicesIntro,
    servicesImage,
    ourTeam,
    featuredProject,
  } = page.homeContent ?? {};
  const serviceItems = services?.serviceRepeater || [];

  return (
    <main>
      <Preloader />
      <SplitTextReveal />
      <HeroAnimation>
        <section className="home-hero">
          <div className="wrapper">
            <div className="first-half">
              <div className="mobius-bg-wrapper">
                {mobiusBgImage?.node && (
                  <Image
                    src={mobiusBgImage.node.sourceUrl}
                    alt={mobiusBgImage.node.altText || ""}
                    width={1600}
                    height={630}
                    sizes="100vw"
                    quality={40}
                    preload
                  />
                )}
              </div>
              <div className="content">
                <h5 className="subhead">
                  <span className="bracket bracket-left">[</span>
                  <span className="subhead-text">WE ARE MOBIUZ</span>
                  <span className="bracket bracket-right">]</span>
                </h5>
                {hero && <h1 className="h1" data-split-text dangerouslySetInnerHTML={{ __html: hero }} />}
              </div>

              <div className="image-parent">
                {heroImages && (
                  <>
                    {[
                      heroImages.heroImage1,
                      heroImages.heroImage2,
                      heroImages.heroImage3,
                      heroImages.heroImage4,
                      heroImages.heroImage5,
                    ].map(
                      (image, index) =>
                        image?.node && (
                          <Image
                            key={index}
                            src={image.node.sourceUrl}
                            alt={image.node.altText || `Hero image ${index + 1}`}
                            width={500}
                            height={500}
                            sizes="(max-width: 768px) 28vw, 18vw"
                            loading="eager"
                          />
                        ),
                    )}
                  </>
                )}

                <div className="orbit-parent"></div>
              </div>
            </div>


            <div className="trail-bars">
              {Array.from({ length: 80 }).map((_, i) => (
                <div
                  key={i}
                  className="trail-bar"
                  style={{ opacity: 1 - i * (1 / 40) }}
                />
              ))}
            </div>

            <div className="second-half">
                <div className="video-zoom-wrapper">
                  <div className="title">
                    <div className="title-item">
                      <div className="title-clip"><h2 className="h2 dark">{videoZoom?.title1}</h2></div>
                    </div>
                    <div className="title-item">
                      <div className="title-clip"><h2 className="h2 dark">{videoZoom?.title2}</h2></div>
                    </div>
                  </div>

                  {videoZoom?.video && (
                    <video src={videoZoom.video} muted playsInline loop></video>
                  )}

                  <div className="subtext">
                    <h4 className="h4 dark">{videoZoom?.caption}</h4>
                  </div>
                </div>
            </div>
          </div>
        </section>

        <section className="featured-clients">
          <div className="wrapper">
            <h5 className="subhead">
              <span className="bracket bracket-left">[</span>
              <span className="subhead-text">FEATURED CLIENTS</span>
              <span className="bracket bracket-right">]</span>
            </h5>
            <h1 className="h2-v2 orange client-list" data-split-text="scroll">
              {featuredClients && featuredClients.map((fc, i) => (
                <span key={i}>
                  {i > 0 && <span className="client-slash"> / </span>}{fc.client}
                </span>
              ))}
            </h1>
          </div>
        </section>
      </HeroAnimation>
      <VideoStack project={featuredProject} />
      <section className="hp-services">
        <h5 className="subhead">
          <span className="bracket bracket-left">[</span>
          <span className="subhead-text">SERVICES</span>
          <span className="bracket bracket-right">]</span>
        </h5>
        <div className="wrapper">
          <div className="left">
            {servicesIntro && <h4 className="h4 dark caps">{servicesIntro}</h4>}
            {servicesImage?.node && (
              <Image
                src={servicesImage.node.sourceUrl}
                alt={servicesImage.node.altText || ""}
                width={servicesImage.node.mediaDetails?.width ?? 1000}
                height={servicesImage.node.mediaDetails?.height ?? 1000}
                sizes="(max-width: 768px) 0px, 40vw"
              />
            )}
          </div>

          <ServicesList items={serviceItems} />
        </div>
      </section>
      <section className="our-team">
        <div className="wrapper">
              <div className="parallax-container">
                {ourTeam?.bgImage?.node && (
                  <Image
                    src={ourTeam.bgImage.node.sourceUrl}
                    alt={ourTeam.bgImage.node.altText || ""}
                    width={1600}
                    height={1200}
                    sizes="100vw"
                  />
                )}
                {ourTeam?.peopleImage?.node && (
                  <Image
                    src={ourTeam.peopleImage.node.sourceUrl}
                    alt={ourTeam.peopleImage.node.altText || ""}
                    width={1600}
                    height={1000}
                    sizes="100vw"
                  />
                )}
              </div>

          <h5 className="subhead">OUR TEAM</h5>
          {ourTeam?.title && (
            <h1
              className="h1 beige"
              dangerouslySetInnerHTML={{ __html: ourTeam.title }}
            />
          )}
          <TransitionLink
            href={ourTeam?.buttonUrl || "/about"}
            className="custom-button"
          >
            <span className="custom-button-label">
              {ourTeam?.buttonLabel || "About Us"}
            </span>
          </TransitionLink>
        </div>
      </section>
    </main>
  );
}
