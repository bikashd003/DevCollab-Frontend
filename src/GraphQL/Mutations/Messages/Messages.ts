import { gql } from '@apollo/client';

export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
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

export const MARK_MESSAGE_AS_READ = gql`
  mutation MarkMessageAsRead($messageId: ID!) {
    markMessageAsRead(messageId: $messageId) {
      id
      isRead
      readAt
    }
  }
`;

export const MARK_CONVERSATION_AS_READ = gql`
  mutation MarkConversationAsRead($conversationId: ID!) {
    markConversationAsRead(conversationId: $conversationId)
  }
`;

export const DELETE_MESSAGE = gql`
  mutation DeleteMessage($messageId: ID!) {
    deleteMessage(messageId: $messageId)
  }
`;
