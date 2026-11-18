import { gql } from "graphql-request";

// ponytail: hard ceiling of 100 posts (WPGraphQL's max page size); switch to
// cursor pagination (pageInfo.endCursor + after:) if the site outgrows it.
export const GET_ALL_POSTS = gql`
  query GetAllPosts {
    posts(first: 100) {
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
        imageMasonry {
          nodes {
            sourceUrl
            altText
          }
        }
        imageBannerHero {
          node {
            sourceUrl
            altText
          }
        }
        storyText
        videoList {
          videoUrl
          videoLabel
        }
      }
    }
  }
`;
