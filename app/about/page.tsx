import SplitTextReveal from "@/components/SplitTextReveal";
import TeamList from "@/components/TeamList";
import { getClient } from "@/lib/graphql-client";
import { GET_TEAM_MEMBERS } from "@/lib/queries/team";
import { TeamMember } from "@/types/wordpress";

export const revalidate = 60;

export default async function About() {
  const client = getClient();
  const { teamMembers } = await client.request<{
    teamMembers: { nodes: TeamMember[] };
  }>(GET_TEAM_MEMBERS);
  const members = teamMembers?.nodes || [];

  return (
    <main>
      <SplitTextReveal />
      <section className="parallax-banner">
        <div className="parallax-container">
          <img src="https://morbiuz.mydemobb.com/wp-content/uploads/2026/04/mobiuz-about-banner.webp" alt="" />
        </div>

        <div className="content">

          <h5 className="subhead">ABOUT US</h5>
          <h1 className="h1 dark">STRATEGY <br /> AND IMAGINATION <br />LOOP <span className="cursive has-underline">ENDLESSLY</span></h1>

        </div>

      </section>


      <section className="orange-section about-us">
        <div className="wrapper">
          <h5 className="subhead">ABOUT US</h5>
          <div className="top-content">
            <h3 className="h3" data-mask-up>Creativity is often treated like a straight line. A beginning, a process, an end. We never believed in that.</h3>

            <h5 className="h5" data-mask-up>Mobiuz Studio was inspired by the Mobius strip, a form with no clear start or finish. A continuous sur face that loops into itself, where every point connects and evolves into the next. It is a quiet reminder that the best ideas are not created once and lef t behind. They are revisited, refined, and reshaped over time.</h5>
          </div>

          <div className="sliding-cards-wrapper">
            <img src="https://morbiuz.mydemobb.com/wp-content/uploads/2026/04/sliding-card.png" />

            <img src="https://morbiuz.mydemobb.com/wp-content/uploads/2026/05/img.png" />

            <img src="https://morbiuz.mydemobb.com/wp-content/uploads/2026/05/img-1.png" />
          </div>
        </div>

      </section>

      <section className="about-our-team">
        <div className="wrapper">
          <div className="top">
            <h5 className="subhead">WHO WE ARE</h5>
            <h1 className="h1 orange" data-split-text="scroll">MEET THE <br />TEAM</h1>
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
              <img src="https://morbiuz.mydemobb.com/wp-content/uploads/2026/04/our-culture.jpg" alt="" />
            </div>
          </div>

          <div className="right">
            <h5 className="subhead">
              OUR CULTURE
            </h5>

            <div className="content-wrapper">
              <h3 className="h3">Great things happen when different <span className="cursive">minds</span>
                collide. At Mobiuz, we embrace the <span className="cursive">messy</span> , the
                <span className="cursive">imperfect</span>, and
                the unexpected.</h3>

              <div className="bottom-body">
                <p className="h5" data-mask-up>
                  Our team thrives on collaboration, pushing boundaries, and bouncing ideas back and forth. Everyone’s voice matters, and that’s where the magic happens. We’re not just co-workers; we’re creators, challengers, and problem solvers together.
                </p>

                <p className="h5" data-mask-up>
                  At Mobiuz, everyone is encouraged to take charge of their work. We give our team the space to experiment and the responsibility to drive their ideas forward. If you’ve got a concept, we’ve got your back. Own it, refine it, and bring it to life.
                </p>
              </div>
            </div>


          </div>


        </div>
      </section>
    </main>
  );
}
