import { gql } from "graphql-request";

export const GET_TEAM_MEMBERS = gql`
  query GetTeamMembers {
    teamMembers(first: 100) {
      nodes {
        title
        memberDetails {
          position
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;
