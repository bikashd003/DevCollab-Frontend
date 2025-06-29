import { gql } from '@apollo/client';

export const GET_USER_DATA = gql`
  query GetUser {
    user {
      username
      email
      profilePicture
      projects {
        title
        description
        imageUrl
        projectLink
      }
      skills {
        title
        proficiency
      }
    }
  }
`;

export const GET_CURRENT_USER_ID = gql`
  query GetCurrentUserId {
    getCurrentUserId
  }
`;
export const GET_CURRENT_USER_DATA = gql`
  query GetCurrentUser {
    getCurrentUser {
      username
      email
      profilePicture
      projects {
        title
        description
        imageUrl
        projectLink
      }
      skills {
        title
        proficiency
      }
    }
  }
`;
