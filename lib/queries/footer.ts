import { gql } from "graphql-request";

export const GET_FOOTER = gql`
  query GetFooter {
    footerSettings {
      footerFieldGroup {
        topTitle
        projectEnquiries
        address
        socials {
          socialsRepeater {
            socialGroup {
              socialLink {
                title
                url
                target
              }
            }
          }
        }
      }
    }
  }
`;
