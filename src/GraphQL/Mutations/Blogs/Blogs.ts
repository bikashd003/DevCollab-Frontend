import { gql } from '@apollo/client';
export const CREATE_BLOG_MUTATION = gql`
  mutation createBlog($title: String!, $content: String!, $tags: [String!]!) {
    createBlog(title: $title, content: $content, tags: $tags) {
      id
      title
      content
      tags
    }
  }
`;
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
        username
        profilePicture
      }
      createdAt
    }
  }
`;
export const LIKE_BLOG = gql`
  mutation likeBlog($id: ID!) {
    likeBlog(id: $id) {
      id
    }
  }
`;
