import { gql } from "graphql-request";

export const GET_MENU_BY_LOCATION = gql`
  query GetMenuByLocation($location: MenuLocationEnum!) {
    menuItems(where: { location: $location }) {
      nodes {
        id
        label
        uri
        parentId
        cssClasses
      }
    }
  }
`;
