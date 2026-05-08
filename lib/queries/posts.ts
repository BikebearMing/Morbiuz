import { gql } from "graphql-request";

export const GET_ALL_POSTS = gql`
  query GetAllPosts {
    posts {
      nodes {
        title
        slug
        date
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        videoProductionPostGroup {
          projectName
          rightSideLabel
        }
      }
    }
  }
`;

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      title
      slug
      date
      content
      excerpt
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      videoProductionPostGroup {
        projectName
        projectYear
        rightSideLabel
        videoLink {
          url
          title
          target
        }
        overviewText
        imageGallery {
          nodes {
            sourceUrl
            altText
          }
        }
        btsGroup {
          btsCreditsRepeater {
            btsCredit {
              role
              nameRepeater {
                name
              }
            }
          }
        }
      }
    }
  }
`;
