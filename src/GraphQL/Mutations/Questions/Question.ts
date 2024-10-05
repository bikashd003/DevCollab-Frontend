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
export const DISLIKE_QUESTION = gql`
  mutation dislikeQuestion($id: ID!) {
    dislikeQuestion(id: $id) {
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
export const CREATE_ANSWER = gql`
  mutation createAnswer($content: String!, $questionId: ID!) {
    createAnswer(content: $content, questionId: $questionId) {
      id
      content
      questionId
    }
  }
`;
export const UPDATE_ANSWER = gql`
  mutation updateAnswer($id: ID!, $content: String!) {
    updateAnswer(id: $id, content: $content) {
      id
      content
    }
  }
`;
export const DELETE_ANSWER = gql`
  mutation deleteAnswer($id: ID!) {
    deleteAnswer(id: $id) {
      id
    }
  }
`;
export const UPVOTE_ANSWER = gql`
  mutation upvoteAnswer($id: ID!) {
    upvoteAnswer(id: $id) {
      id
    }
  }
`;
export const DOWNVOTE_ANSWER = gql`
  mutation downvoteAnswer($id: ID!) {
    downvoteAnswer(id: $id) {
      id
    }
  }
`;
export const ACCEPT_ANSWER = gql`
  mutation acceptAnswer($id: ID!) {
    acceptAnswer(id: $id) {
      id
    }
  }
`;
