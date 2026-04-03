import { gql } from "graphql-request";

export const GET_HOME_PAGE = gql`
  query GetHomePage {
    page(id: "home", idType: URI) {
      title
      home {
        hero
        subtext
        featuredClients {
          client
        }
        heroImages {
          heroImage1 {
            node {
              sourceUrl
              altText
            }
          }
          heroImage2 {
            node {
              sourceUrl
              altText
            }
          }
          heroImage3 {
            node {
              sourceUrl
              altText
            }
          }
          heroImage4 {
            node {
              sourceUrl
              altText
            }
          }
          heroImage5 {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  }
`;
