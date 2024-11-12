import { gql } from '@apollo/client';

export const UPDATE_USER_PROFILE_PICTURE = gql`
  mutation UpdateUserProfilePicture($profilePicture: String!) {
    updateUserProfilePicture(profilePicture: $profilePicture) {
      id
      profilePicture
    }
  }
`;

export const UPDATE_USER_PROFILE_DETAILS = gql`
  mutation UpdateUserProfileDetails($profileDetails: UserProfileDetailsInput!) {
    updateUserProfileDetails(profileDetails: $profileDetails) {
      id
      bio
      location
      company
    }
  }
`;
