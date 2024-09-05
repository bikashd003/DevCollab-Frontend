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
      author {
        username
        profilePicture
      }
      createdAt
    }
  }
`;
export const LIKE_BLOG = gql`
  mutation likeBlog($blogId: ID!, $userId: Id) {
    likeBlog(blogId: $blogId, userId: $userId) {
      id
      blogId
      userId
    }
  }
`;
