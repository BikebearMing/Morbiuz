import ContactForm, { GfForm } from "@/components/ContactForm";
import FaqAccordion from "@/components/FaqAccordion";
import SplitTextReveal from "@/components/SplitTextReveal";
import { getClient } from "@/lib/graphql-client";
import { GET_CONTACT_FORM, GET_CONTACT_PAGE } from "@/lib/queries/contact";
import { ContactContentFields } from "@/types/wordpress";
import type { Metadata } from "next";
import { getPageSeo, buildMetadata } from "@/lib/seo";

export const revalidate = 60;

const FORM_ID = 1;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("contact");
  return buildMetadata(seo, { path: "/contact", fallbackTitle: "Contact" });
}

export default async function Contact() {
  const client = getClient();
  const [{ gfForm }, { page }] = await Promise.all([
    client.request<{ gfForm: GfForm | null }>(GET_CONTACT_FORM, {
      id: String(FORM_ID),
    }),
    client.request<{
      page: { contactContent: ContactContentFields | null } | null;
    }>(GET_CONTACT_PAGE),
  ]);

  const contact = page?.contactContent ?? null;
  const bannerImg = contact?.bannerImage?.node;
  const faqImg1 = contact?.faqImage1?.node;
  const faqImg2 = contact?.faqImage2?.node;
  const faqItems = (contact?.faqs || [])
    .map((f) => ({ question: f.question || "", answer: f.answer || "" }))
    .filter((f) => f.question);

  return (
    <main>
      <SplitTextReveal />
      <section className="parallax-banner">
        <div className="parallax-container">
          {bannerImg && (
            <img src={bannerImg.sourceUrl} alt={bannerImg.altText || ""} />
          )}
        </div>
        <div className="content">
          {contact?.bannerSubhead && (
            <h5 className="subhead">
              <span className="bracket">[</span>
              <span className="subhead-text">{contact.bannerSubhead}</span>
              <span className="bracket">]</span>
            </h5>
          )}
          {contact?.bannerTitle && (
            <h1
              className="h1 dark"
              dangerouslySetInnerHTML={{ __html: contact.bannerTitle }}
            />
          )}
        </div>
      </section>
      <section className="contact-page orange-section">
        <div className="contact-top">
          <div className="contact-heading">
            {contact?.messageSubhead && (
              <h5 className="subhead">
                <span className="bracket">[</span>
                <span className="subhead-text">{contact.messageSubhead}</span>
                <span className="bracket">]</span>
              </h5>
            )}
            {contact?.messageTitle && (
              <h1
                className="h2-v2"
                dangerouslySetInnerHTML={{ __html: contact.messageTitle }}
              />
            )}
          </div>

          <div className="contact-info">
            {contact?.contactIntro && (
              <p className="contact-intro">{contact.contactIntro}</p>
            )}

            {contact?.email && (
              <div className="contact-info-block">
                <h6 className="contact-info-label">EMAIL</h6>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </div>
            )}

            {contact?.address && (
              <div className="contact-info-block">
                <h6 className="contact-info-label">ADDRESS</h6>
                <p>{contact.address}</p>
              </div>
            )}
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
                {contact?.faqSubhead && (
                  <h5 className="subhead dark">[ {contact.faqSubhead} ]</h5>
                )}
                {contact?.faqTitle && (
                  <h1 className="h1 orange" data-split-text="scroll">
                    {contact.faqTitle}
                  </h1>
                )}
            </div>

            <div className="bottom">
                <div className="left">
                    {faqImg1 && (
                      <img src={faqImg1.sourceUrl} alt={faqImg1.altText || ""} />
                    )}
                    {faqImg2 && (
                      <img src={faqImg2.sourceUrl} alt={faqImg2.altText || ""} />
                    )}
                </div>

                <div className="right">
                    <FaqAccordion
                      items={faqItems.length > 0 ? faqItems : undefined}
                    />
                </div>
            </div>
        </div>
      </section>
    </main>
  );
}
