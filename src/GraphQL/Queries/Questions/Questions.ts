import { gql } from "@apollo/client";

export const GET_ALL_QUESTIONS = gql`
query getQuestions {
  getQuestions {
    id
    title
    content
    tags
    author {
      username
      profilePicture
    }
  }
}
`