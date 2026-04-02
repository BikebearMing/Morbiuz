import { gql } from "graphql-request";

export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    categories {
      nodes {
        name
        slug
        count
      }
    }
  }
`;


