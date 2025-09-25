import { useEffect, useCallback } from 'react';
import type { MessageData, TypingData, OnlineStatusData } from '../Services/MessageSocket';
import { messageSocketService } from '../Services/MessageSocket';

interface UseMessageSocketProps {
  currentUserId?: string;
  onNewMessage?: (data: MessageData) => void;
  onMessageSent?: () => void;
  onMessageError?: (error: string) => void;
  onUserTyping?: (data: TypingData) => void;
  onUserStoppedTyping?: (data: { userId: string }) => void;
  onUserOnlineStatus?: (data: OnlineStatusData) => void;
}

export const useMessageSocket = ({
  currentUserId,
  onNewMessage,
  onMessageSent,
  onMessageError,
  onUserTyping,
  onUserStoppedTyping,
  onUserOnlineStatus,
}: UseMessageSocketProps) => {
  useEffect(() => {
    if (!currentUserId) return;

    messageSocketService.init(currentUserId);

    const unsubscribers: (() => void)[] = [];

    if (onNewMessage) {
      unsubscribers.push(messageSocketService.onNewMessage(onNewMessage));
    }

    if (onMessageSent) {
      unsubscribers.push(messageSocketService.onMessageSent(onMessageSent));
    }

    if (onMessageError) {
      unsubscribers.push(messageSocketService.onMessageError(({ error }) => onMessageError(error)));
    }

    if (onUserTyping) {
      unsubscribers.push(messageSocketService.onUserTyping(onUserTyping));
    }

    if (onUserStoppedTyping) {
      unsubscribers.push(messageSocketService.onUserStoppedTyping(onUserStoppedTyping));
    }

    if (onUserOnlineStatus) {
      unsubscribers.push(messageSocketService.onUserOnlineStatus(onUserOnlineStatus));
    }

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
      messageSocketService.cleanup();
    };
  }, [
    currentUserId,
    onNewMessage,
    onMessageSent,
    onMessageError,
    onUserTyping,
    onUserStoppedTyping,
    onUserOnlineStatus,
  ]);

  const sendMessage = useCallback((receiverId: string, message: any) => {
    messageSocketService.sendMessage(receiverId, message);
  }, []);

  const markMessageAsRead = useCallback((messageId: string, senderId: string) => {
    messageSocketService.markMessageAsRead(messageId, senderId);
  }, []);

  const startTyping = useCallback((receiverId: string) => {
    messageSocketService.startTyping(receiverId);
  }, []);

  const stopTyping = useCallback((receiverId: string) => {
    messageSocketService.stopTyping(receiverId);
  }, []);

  const autoStopTyping = useCallback((receiverId: string, delay?: number) => {
    messageSocketService.autoStopTyping(receiverId, delay);
  }, []);

  return {
    sendMessage,
    markMessageAsRead,
    startTyping,
    stopTyping,
    autoStopTyping,
  };
};
