import { gql } from '@apollo/client';

export const ADD_QUESTION_MUTAION = gql`
  mutation CreateQuestion($title: String!, $content: String!, $tags: [String!]!) {
    createQuestion(title: $title, content: $content, tags: $tags) {
      id
      title
      content
      tags
    }
  }
`;
export const LIKE_QUESTION = gql`
  mutation likeQuestion($id: ID!) {
    likeQuestion(id: $id) {
      id
    }
  }
`;
export const CREATE_COMMENT = gql`
  mutation createComment($content: String!, $questionId: ID!) {
    createComment(content: $content, questionId: $questionId) {
      id
      content
      questionId
    }
  }
`;
export const UPDATE_COMMENT = gql`
  mutation updateComment($id: ID!, $content: String!) {
    updateComment(id: $id, content: $content) {
      id
      content
    }
  }
`;
export const DELETE_COMMENT = gql`
  mutation deleteComment($id: ID!) {
    deleteComment(id: $id) {
      id
    }
  }
`;
export const DELETE_QUESTION = gql`
  mutation deleteQuestion($id: ID!) {
    deleteQuestion(id: $id) {
      id
    }
  }
`;
export const UPDATE_QUESTION = gql`
  mutation updateQuestion($id: ID!, $title: String!, $content: String!, $tags: [String!]!) {
    updateQuestion(id: $id, title: $title, content: $content, tags: $tags) {
      id
      title
      content
      tags
    }
  }
`;
