import { gql } from '@apollo/client';

const ADD_PROJECT_MUTATION = gql`
  mutation createProject(
    $title: String!
    $description: String!
    $imageUrl: String
    $projectLink: String!
  ) {
    createProject(
      title: $title
      description: $description
      imageUrl: $imageUrl
      projectLink: $projectLink
    ) {
      id
      title
      description
      imageUrl
      projectLink
    }
  }
`;
export default ADD_PROJECT_MUTATION;
export const DELETE_PROJECT = gql`
  mutation deleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
    }
  }
`;
export const UPDATE_PROJECT = gql`
  mutation updateProject(
    $id: ID!
    $title: String!
    $description: String!
    $imageUrl: String
    $projectLink: String!
  ) {
    updateProject(
      id: $id
      title: $title
      description: $description
      imageUrl: $imageUrl
      projectLink: $projectLink
    ) {
      id
      title
      description
      imageUrl
      projectLink
    }
  }
`;
