import { gql } from "graphql-request";

export const GET_BRAND_DESIGN_PAGE = gql`
  query GetBrandDesignPage {
    page(id: "brand-design", idType: URI) {
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
