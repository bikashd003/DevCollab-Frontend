import { gql } from '@apollo/client';

export const GET_USER_PROJECTS = gql`
  query GetUserProjects {
    user {
      projects {
        id
        title
        description
        imageUrl
        projectLink
      }
    }
  }
`;
