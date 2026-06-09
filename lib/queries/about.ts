import { gql } from "graphql-request";

export const GET_ABOUT_PAGE = gql`
  query GetAboutPage {
    page(id: "about", idType: URI) {
      aboutContent {
        bannerImage {
          node {
            sourceUrl
            altText
          }
        }
        bannerSubhead
        bannerTitle
        introSubhead
        introHeading
        introBody
        slidingCards {
          image {
            node {
              sourceUrl
              altText
            }
          }
        }
        teamSubhead
        teamTitle
        cultureImage {
          node {
            sourceUrl
            altText
          }
        }
        cultureSubhead
        cultureHeading
        cultureParagraphs {
          text
        }
      }
    }
  }
`;
