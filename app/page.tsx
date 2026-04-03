import { getClient } from "@/lib/graphql-client";
import { GET_HOME_PAGE } from "@/lib/queries/home";
import { HomePage } from "@/types/wordpress";
import HeroAnimation from "@/components/HeroAnimation";
import VideoStack from "@/components/VideoStack";

export const revalidate = 3600;

export default async function Home() {
  const client = getClient();
  const { page } = await client.request<{ page: HomePage }>(GET_HOME_PAGE);

  const { hero, subtext, heroImages, featuredClients } = page.home;

  return (
    <main>
      <HeroAnimation>
        <section className="home-hero">
          <div className="wrapper">
            <div className="first-half">
              <div className="mobius-bg-wrapper">
                <img src="https://morbiuz.mydemobb.com/wp-content/uploads/2026/04/mobius-bg-scaled.png" alt="" />
              </div>
              <div className="content">
                <h5 className="subhead">
                  <span className="bracket bracket-left">[</span>
                  <span className="subhead-text">WE ARE MOBIUZ</span>
                  <span className="bracket bracket-right">]</span>
                </h5>
                {hero && <h1 className="h1" dangerouslySetInnerHTML={{ __html: hero }} />}
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
                          <img
                            key={index}
                            src={image.node.sourceUrl}
                            alt={image.node.altText || `Hero image ${index + 1}`}
                          />
                        ),
                    )}
                  </>
                )}

                <div className="orbit-parent"></div>
              </div>
            </div>


            <div className="trail-bars">
              {Array.from({ length: 70 }).map((_, i) => (
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
                    <h2 className="h2 dark">strategy</h2>
                    <h2 className="h2 dark">imagination</h2>
                  </div>

                  <video src="https://streamable.com/l/4wsqgh/mp4-high.mp4" muted playsInline loop></video>

                  <div className="subtext">
                    <h4 className="h4 dark">We designs infinite creative experiences where strategy and imagination flow as one.</h4>
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
            <h1 className="h2-v2 orange client-list">
              {featuredClients && featuredClients.map((fc, i) => (
                <span key={i}>
                  {i > 0 && <span className="client-slash"> / </span>}{fc.client}
                </span>
              ))}
            </h1>
          </div>
        </section>
      </HeroAnimation>
      <VideoStack />
    </main>
  );
}
