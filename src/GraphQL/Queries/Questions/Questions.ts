import { gql } from '@apollo/client';

export const GET_ALL_QUESTIONS = gql`
  query getQuestions($limit: Int!, $offset: Int!) {
    getQuestions(limit: $limit, offset: $offset) {
      questions {
        id
        title
        tags
        upvotes {
          id
        }
        downvotes {
          id
        }
        author {
          username
          profilePicture
        }
        createdAt
      }
      totalQuestions
      totalPages
    }
  }
`;
export const SEARCH_QUESTIONS = gql`
  query SearchQuestions(
    $searchTerm: String
    $limit: Int!
    $offset: Int!
    $tags: [String]
    $userId: ID
  ) {
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
        upvotes {
          id
        }
        downvotes {
          id
        }
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
export const GET_QUESTION_BY_ID = gql`
  query getQuestionById($id: ID!) {
    getQuestionById(id: $id) {
      id
      title
      content
      tags
      views
      isBookmarked
      upvotes {
        id
      }
      downvotes {
        id
      }
      author {
        id
        username
        profilePicture
      }
      createdAt
      answers {
        id
        content
        author {
          id
          username
          profilePicture
        }
        upvotes {
          id
        }
        downvotes {
          id
        }
        isAccepted
        createdAt
      }
    }
  }
`;

export const GET_USER_BOOKMARKS = gql`
  query getUserBookmarks($limit: Int!, $offset: Int!) {
    getUserBookmarks(limit: $limit, offset: $offset) {
      bookmarks {
        id
        createdAt
        question {
          id
          title
          content
          tags
          views
          author {
            id
            username
            profilePicture
          }
          createdAt
        }
      }
      totalBookmarks
      totalPages
    }
  }
`;

export const IS_QUESTION_BOOKMARKED = gql`
  query isQuestionBookmarked($questionId: ID!) {
    isQuestionBookmarked(questionId: $questionId)
  }
`;
