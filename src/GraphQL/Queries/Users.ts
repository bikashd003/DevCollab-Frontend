import { gql } from "@apollo/client";

export const GET_USER_DATA = gql`
query GetUser{
  user{
    username
    profilePicture
    projects{
      title
      description
      imageUrl
      projectLink
    }
    skills{
      title
      proficiency
    }
  }
}
`;
