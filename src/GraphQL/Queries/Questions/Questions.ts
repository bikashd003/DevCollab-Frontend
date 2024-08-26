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
export const SEARCH_QUESTIONS = gql`
  query SearchQuestions($searchTerm: String, $limit: Int!, $offset: Int!, $tags: [String], $userId: ID) {
    searchQuestions(
      searchTerm: $searchTerm
      limit: $limit
      offset: $offset
      tags: $tags
      userId: $userId
    ) {
      questions {
        id
        title
        content
        tags
        author {
          id
          username
          profilePicture
        }
        createdAt
      }
      totalPages
    }
  }
`;