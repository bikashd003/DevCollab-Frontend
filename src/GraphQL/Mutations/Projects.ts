
import gql from 'graphql-tag';

const ADD_PROJECT_MUTATION = gql`
  mutation createProject($title: String!, $description: String!, $imageUrl: String, $projectLink: String) {
    createProject(input: { title: $title, description: $description, imageUrl: $imageUrl, projectLink: $projectLink }) {
      id
      title
      description
      imageUrl
      projectLink
    }
  }
`;
export default ADD_PROJECT_MUTATION;