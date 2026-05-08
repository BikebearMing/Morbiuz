import { gql } from "graphql-request";

export const GET_VIDEO_PRODUCTION_PAGE = gql`
  query GetVideoProductionPage {
    page(id: "video-production", idType: URI) {
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
                    uri
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
