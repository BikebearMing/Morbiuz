import { getClient } from "@/lib/graphql-client";
import { GET_HOME_PAGE } from "@/lib/queries/home";
import { HomePage } from "@/types/wordpress";

export const revalidate = 3600;

export default async function Home() {
  const client = getClient();
  const { page } = await client.request<{ page: HomePage }>(GET_HOME_PAGE);

  const { hero, subtext, heroImages } = page.home;

  return (
    <main>
      <section className="home-hero">
        <div className="wrapper">
          <div className="first-half">
            <div className="content">
              <h5 className="subhead">WE ARE MOBIUZ</h5>
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
            </div>
          </div>


          <div className="second-half">
            
          </div>
        </div>
      </section>
    </main>
  );
}
