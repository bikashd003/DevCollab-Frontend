import { gql } from '@apollo/client';

export const ADD_SKILL_MUTAION = gql`
  mutation createSkill($title: String!, $proficiency: Int) {
    createSkill(title: $title, proficiency: $proficiency) {
      title
      proficiency
    }
  }
`;
export const DELETE_SKILL = gql`
  mutation deleteSkill($id: ID!) {
    deleteSkill(id: $id) {
      id
    }
  }
`;
export const UPDATE_SKILL = gql`
  mutation updateSkill($id: ID!, $title: String!, $proficiency: Int) {
    updateSkill(id: $id, title: $title, proficiency: $proficiency) {
      title
      proficiency
    }
  }
`;
