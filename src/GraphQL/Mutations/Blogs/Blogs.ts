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
export const LIKE_BLOG = gql`
  mutation likeBlog($id: ID!) {
    likeBlog(id: $id) {
      id
    }
  }
`;
export const CREATE_COMMENT = gql`
  mutation createComment($content: String!, $blogId: ID!) {
    createComment(content: $content, blogId: $blogId) {
      id
      content
      blogId
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
export const DELETE_BLOG = gql`
  mutation deleteBlog($id: ID!) {
    deleteBlog(id: $id) {
      id
    }
  }
`;
export const UPDATE_BLOG = gql`
  mutation updateBlog($id: ID!, $title: String!, $content: String!, $tags: [String!]!) {
    updateBlog(id: $id, title: $title, content: $content, tags: $tags) {
      id
      title
      content
      tags
    }
  }
`;
