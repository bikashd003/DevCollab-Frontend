import { gql } from '@apollo/client';
export const CREATE_BLOG_MUTATION = gql`
  mutation createBlog($title: String!, $content: String!) {
    createBlog(title: $title, content: $content) {
      id
      title
      content
    }
  }
`;
export const GET_BLOGS = gql`
  query getBlogs {
    getBlogs {
      id
      title
      content
      author {
        id
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
