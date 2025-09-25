import { gql } from '@apollo/client';

export const MESSAGE_RECEIVED_SUBSCRIPTION = gql`
  subscription MessageReceived($userId: ID!) {
    messageReceived(userId: $userId) {
      id
      sender {
        id
        username
        profilePicture
      }
      receiver {
        id
        username
        profilePicture
      }
      content
      messageType
      isRead
      createdAt
    }
  }
`;

export const MESSAGE_READ_SUBSCRIPTION = gql`
  subscription MessageRead($conversationId: ID!) {
    messageRead(conversationId: $conversationId) {
      id
      isRead
      readAt
    }
  }
`;
