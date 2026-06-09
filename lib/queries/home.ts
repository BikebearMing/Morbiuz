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
        services {
          serviceRepeater {
            serviceGroup {
              title
              subtext
              serviceImage {
                node {
                  sourceUrl
                  altText
                }
              }
            }
          }
        }
      }
      homeContent {
        mobiusBgImage {
          node {
            sourceUrl
            altText
          }
        }
        videoZoom {
          title1
          title2
          video
          caption
        }
        servicesIntro
        servicesImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        ourTeam {
          bgImage {
            node {
              sourceUrl
              altText
            }
          }
          peopleImage {
            node {
              sourceUrl
              altText
            }
          }
          title
          buttonLabel
          buttonUrl
        }
        featuredProject {
          projectName
          client
          year
          video1
          video2
        }
      }
    }
  }
`;
