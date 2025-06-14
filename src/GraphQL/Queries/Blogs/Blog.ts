import { gql } from '@apollo/client';
export const GET_BLOGS = gql`
  query getBlogs {
    getBlogs {
      id
      title
      content
      tags
      likes {
        id
        username
        profilePicture
      }
      author {
        id
        username
        profilePicture
      }
      createdAt
    }
  }
`;
export const GET_BLOG_DETAILS = gql`
  query GetBlogDetails($id: ID!) {
    getBlogById(id: $id) {
      id
      title
      content
      tags
      likes {
        id
        username
        profilePicture
      }
      author {
        id
        username
        profilePicture
      }
      comments {
        id
        content
        author {
          username
          profilePicture
        }
        createdAt
      }
      createdAt
    }
  }
`;
export const GET_TOP_CONTRIBUTORS = gql`
  query GetTopContributors {
    topContributors {
      username
      profilePicture
    }
  }
`;

export const GET_POPULAR_TAGS = gql`
  query GetPopularTags {
    getPopularTags {
      tag
      count
    }
  }
`;
