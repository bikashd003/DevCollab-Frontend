import { gql } from '@apollo/client';

export const CREATE_EDITOR = gql`
  mutation createEditor($title: String!) {
    createEditor(title: $title) {
      id
    }
  }
`;

export const UPDATE_EDITOR = gql`
  mutation updateEditor($id: ID!, $code: String!) {
    updateEditor(id: $id, code: $code)
  }
`;
export const DELETE_EDITOR = gql`
  mutation deleteEditor($id: ID!) {
    deleteEditor(id: $id)
  }
`;
