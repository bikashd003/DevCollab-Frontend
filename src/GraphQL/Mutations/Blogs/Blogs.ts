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
