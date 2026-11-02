import { gql } from "graphql-request";

// Fetched by menu name rather than theme location: the headless CMS theme
// doesn't register menu locations, so a location lookup comes back empty.
export const GET_MENU_BY_NAME = gql`
  query GetMenuByName($name: ID!) {
    menu(id: $name, idType: NAME) {
      menuItems(first: 100) {
        nodes {
          id
          label
          uri
          parentId
          cssClasses
        }
      }
    }
  }
`;
