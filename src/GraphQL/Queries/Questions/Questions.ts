import { gql } from "@apollo/client";

export const GET_ALL_QUESTIONS = gql`
  query getQuestions($limit: Int!, $offset: Int!) {
    getQuestions(limit: $limit, offset: $offset) {
      questions {
        id
        title
        content
        tags
        author {
          username
          profilePicture
        }
      }
     totalQuestions
      totalPages
    }
  }
`;