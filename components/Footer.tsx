import { getClient } from "@/lib/graphql-client";
import { GET_FOOTER } from "@/lib/queries/footer";
import { FooterFields } from "@/types/wordpress";
import FooterBars from "./FooterBars";

export async function Footer() {
  const client = getClient();
  const { footerSettings } = await client.request<{
    footerSettings: { footerFieldGroup: FooterFields };
  }>(GET_FOOTER);

  const { topTitle, projectEnquiries, address, socials } =
    footerSettings.footerFieldGroup;
  const socialItems = socials?.socialsRepeater || [];

  return (
    <footer className="site-footer">
      <div className="footer-top">
        {topTitle && <h1 className="h1 footer-title" data-split-text="scroll">{topTitle}</h1>}
        {/* TODO: arrow graphic */}
        <div className="footer-image">
          <img
            src="https://morbiuz.mydemobb.com/wp-content/uploads/2026/04/Rectangle.png"
            alt=""
          />
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-info">
          <div className="footer-col">
            <p className="body footer-label" data-mask-up>PROJECT INQUIRIES</p>
            {projectEnquiries && (
              <a href={`mailto:${projectEnquiries}`} className="body footer-value" data-mask-up>
                {projectEnquiries}
              </a>
            )}
          </div>

          <div className="footer-col">
            <p className="body footer-label" data-mask-up>ADDRESS</p>
            {address && <p className="body footer-value" data-mask-up>{address}</p>}
          </div>

          <div className="footer-col">
            {socialItems.map((item, i) => (
              <a
                key={i}
                href={item.socialGroup.socialLink.url}
                target={item.socialGroup.socialLink.target || "_blank"}
                rel="noopener noreferrer"
                className="body footer-social-link"
                data-mask-up
              >
                {item.socialGroup.socialLink.title}
              </a>
            ))}
          </div>
        </div>

        <FooterBars />

        <div className="footer-legal">
          <span className="body" data-mask-up><span className="copyright-symbol">&copy;</span>MOBIUZ STUDIO</span>
          <a href="#" className="body" data-mask-up>COOKIE</a>
          <a href="#" className="body" data-mask-up>PRIVACY POLICY</a>
        </div>
      </div>
    </footer>
  );
}
