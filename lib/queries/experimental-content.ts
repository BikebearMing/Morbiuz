import { gql } from "graphql-request";

export const GET_EXPERIMENTAL_CONTENT_PAGE = gql`
  query GetExperimentalContentPage {
    page(id: "experimental-content", idType: URI) {
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
