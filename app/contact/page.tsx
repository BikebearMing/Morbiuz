import ContactForm, { GfForm } from "@/components/ContactForm";
import FaqAccordion from "@/components/FaqAccordion";
import SplitTextReveal from "@/components/SplitTextReveal";
import { getClient } from "@/lib/graphql-client";
import { GET_CONTACT_FORM } from "@/lib/queries/contact";

export const revalidate = 60;

const FORM_ID = 1;

export default async function Contact() {
  const client = getClient();
  const { gfForm } = await client.request<{ gfForm: GfForm | null }>(
    GET_CONTACT_FORM,
    { id: String(FORM_ID) }
  );

  return (
    <main>
      <SplitTextReveal />
      <section className="parallax-banner">
        <div className="parallax-container">
          <img src="https://morbiuz.mydemobb.com/wp-content/uploads/2026/05/contact-banner.png" alt="" />
        </div>
        <div className="content">
          <h5 className="subhead">
            <span className="bracket">[</span>
            <span className="subhead-text">CONTACT US</span>
            <span className="bracket">]</span>
          </h5>
          <h1 className="h1 dark">LET&rsquo;S <span className="cursive has-underline">talk</span></h1>
        </div>
      </section>
      <section className="contact-page orange-section">
        <div className="contact-top">
          <div className="contact-heading">
            <h5 className="subhead">
              <span className="bracket">[</span>
              <span className="subhead-text">SEND A MESSAGE</span>
              <span className="bracket">]</span>
            </h5>
            <h1 className="h2-v2">
              WE&rsquo;RE HERE <br />
              FOR THE <br />
              NEXT <span className="cursive">loop</span>
            </h1>
          </div>

          <div className="contact-info">
            <p className="contact-intro">
              We believe in collaboration that flows and ideas that never stop
              evolving. If you&rsquo;re ready to take your brand to the next
              level, we&rsquo;re ready to make it happen. Reach out, and
              let&rsquo;s start the cycle of creativity together.
            </p>

            <div className="contact-info-block">
              <h6 className="contact-info-label">EMAIL</h6>
              <a href="mailto:enquiry@mobiuzstudio.com">
                enquiry@mobiuzstudio.com
              </a>
            </div>

            <div className="contact-info-block">
              <h6 className="contact-info-label">ADDRESS</h6>
              <p>
                E-35-3, 3 Two Square, 2, Jalan 19/1, Seksyen 19, 46300 Petaling
                Jaya, Selangor.
              </p>
            </div>
          </div>
        </div>

        <div className="contact-form-wrapper">
          {gfForm ? (
            <ContactForm form={gfForm} />
          ) : (
            <p className="h5">Form unavailable. Please try again later.</p>
          )}
        </div>
      </section>

      <section className="contact-faq">
        <div className="wrapper">
            <div className="top">
                <h5 className="subhead dark">[ ASK US ]</h5>
                <h1 className="h1 orange">FAQs</h1>
            </div>

            <div className="bottom">
                <div className="left">
                    <img src="https://morbiuz.mydemobb.com/wp-content/uploads/2026/05/faq-img-1.png" alt="" />

                    <img src="https://morbiuz.mydemobb.com/wp-content/uploads/2026/05/faq-img-2-1.png" alt="" />
                </div>

                <div className="right">
                    <FaqAccordion />
                </div>
            </div>
        </div>
      </section>
    </main>
  );
}
