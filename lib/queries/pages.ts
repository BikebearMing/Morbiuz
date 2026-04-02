import { gql } from "graphql-request";

export const GET_ALL_PAGES = gql`
  query GetAllPages {
    pages {
      nodes {
        title
        slug
      }
    }
  }
`;

export const GET_PAGE_BY_SLUG = gql`
  query GetPageBySlug($slug: ID!) {
    page(id: $slug, idType: URI) {
      title
      slug
      content
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;
