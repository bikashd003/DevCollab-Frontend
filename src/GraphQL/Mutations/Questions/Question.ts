import { gql } from "@apollo/client";

export const ADD_QUESTION_MUTAION = gql`
  mutation CreateQuestion($title: String!, $content: String!, $tags: [String!]!) {
    createQuestion(title: $title, content: $content, tags: $tags) {
      id
      title
      content
      tags
    }
}
`