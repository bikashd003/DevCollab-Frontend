import { gql } from '@apollo/client';

export const GET_CONVERSATIONS = gql`
  query GetConversations {
    getConversations {
      id
      participants {
        id
        username
        profilePicture
        isOnline
        lastOnline
      }
      lastMessage {
        id
        content
        createdAt
        sender {
          id
          username
        }
      }
      lastMessageAt
      unreadCount
      isActive
    }
  }
`;

export const GET_CONVERSATION = gql`
  query GetConversation($participantId: ID!) {
    getConversation(participantId: $participantId) {
      id
      participants {
        id
        username
        profilePicture
        isOnline
        lastOnline
      }
      lastMessage {
        id
        content
        createdAt
      }
      lastMessageAt
      unreadCount
      isActive
    }
  }
`;

export const GET_MESSAGES = gql`
  query GetMessages($conversationId: ID!, $limit: Int, $offset: Int) {
    getMessages(conversationId: $conversationId, limit: $limit, offset: $offset) {
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
      readAt
      createdAt
      updatedAt
    }
  }
`;

export const GET_UNREAD_MESSAGES_COUNT = gql`
  query GetUnreadMessagesCount {
    getUnreadMessagesCount
  }
`;

export const GET_USER_CONNECTIONS = gql`
  query GetUserConnections {
    user {
      id
      connections {
        id
        username
        profilePicture
        isOnline
        lastOnline
      }
    }
  }
`;
