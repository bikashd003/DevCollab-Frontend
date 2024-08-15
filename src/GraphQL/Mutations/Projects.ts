import { gql } from '@apollo/client';

const ADD_PROJECT_MUTATION = gql`
  mutation createProject($title: String!, $description: String!, $imageUrl: String, $projectLink: String!) {
    createProject(title: $title, description: $description, imageUrl: $imageUrl, projectLink: $projectLink) {
      title
      description
      imageUrl
      projectLink
    }
  }
`;
export default ADD_PROJECT_MUTATION;
