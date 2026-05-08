import { gql } from "graphql-request";

export const GET_SOCIAL_MEDIA_PAGE = gql`
  query GetSocialMediaPage {
    page(id: "social-media", idType: URI) {
      title
      content
      workPages {
        workTopBanner {
          bannerSubhead
          bannerTitle
          bannerImage {
            node {
              sourceUrl
              altText
            }
          }
        }
        orangeSectionInfo {
          heading
          infoPillarWrapper {
            infoPillarRepeater {
              infoChild {
                infoTitle
                infoSubtext
                infoImage {
                  node {
                    sourceUrl
                    altText
                  }
                }
              }
            }
          }
        }
        ourWorks {
          ourWorkSubheader
          ourWorkTitle
          worksWrapper {
            ourWorkRepeater {
              workGroup {
                workTitle
                workLink {
                  nodes {
                    slug
                  }
                }
                workImage {
                  node {
                    sourceUrl
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
