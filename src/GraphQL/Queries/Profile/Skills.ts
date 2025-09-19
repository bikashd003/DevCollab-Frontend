import { gql } from '@apollo/client';

export const GET_USER_SKILLS = gql`
  query getUserSkills {
    getUserSkills {
      id
      title
      proficiency
    }
  }
`;
