import { socket } from '../Utilities/Socket';

export interface MessageData {
  id: string;
  senderId: string;
  senderUsername: string;
  senderProfilePicture?: string;
  content: string;
  createdAt: string;
  conversationId: string;
}

export interface TypingData {
  userId: string;
  username: string;
}

export interface OnlineStatusData {
  userId: string;
  isOnline: boolean;
}

class MessageSocketService {
  private typingTimeouts: Map<string, NodeJS.Timeout> = new Map();

  init(_userId: string) {
    socket.emit('joinUserRoom');
    this.setupEventListeners();
  }

  private setupEventListeners() {
    socket.off('newMessage');
    socket.off('messageSent');
    socket.off('messageError');
    socket.off('messageRead');
    socket.off('userTypingMessage');
    socket.off('userStoppedTypingMessage');
    socket.off('userOnlineStatus');

    socket.on('newMessage', this.handleNewMessage.bind(this));
    socket.on('messageSent', this.handleMessageSent.bind(this));
    socket.on('messageError', this.handleMessageError.bind(this));
    socket.on('messageRead', this.handleMessageRead.bind(this));
    socket.on('userTypingMessage', this.handleUserTyping.bind(this));
    socket.on('userStoppedTypingMessage', this.handleUserStoppedTyping.bind(this));
    socket.on('userOnlineStatus', this.handleOnlineStatus.bind(this));
  }

  // Send a direct message
  sendMessage(receiverId: string, message: any) {
    socket.emit('sendDirectMessage', {
      receiverId,
      message,
    });
  }

  // Mark message as read
  markMessageAsRead(messageId: string, senderId: string) {
    socket.emit('markMessageRead', {
      messageId,
      senderId,
    });
  }

  // Send typing indicator
  startTyping(receiverId: string) {
    socket.emit('userTypingMessage', { receiverId });
  }

  // Stop typing indicator
  stopTyping(receiverId: string) {
    socket.emit('userStoppedTypingMessage', { receiverId });

    // Clear any existing timeout for this receiver
    const timeoutId = this.typingTimeouts.get(receiverId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.typingTimeouts.delete(receiverId);
    }
  }

  // Auto-stop typing after delay
  autoStopTyping(receiverId: string, delay: number = 3000) {
    // Clear existing timeout
    const existingTimeout = this.typingTimeouts.get(receiverId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new timeout
    const timeoutId = setTimeout(() => {
      this.stopTyping(receiverId);
    }, delay);

    this.typingTimeouts.set(receiverId, timeoutId);
  }

  // Event handlers
  private handleNewMessage(data: MessageData) {
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('newMessage', { detail: data }));
  }

  private handleMessageSent(data: { messageId: string }) {
    window.dispatchEvent(new CustomEvent('messageSent', { detail: data }));
  }

  private handleMessageError(data: { error: string }) {
    window.dispatchEvent(new CustomEvent('messageError', { detail: data }));
  }

  private handleMessageRead(data: { messageId: string }) {
    window.dispatchEvent(new CustomEvent('messageRead', { detail: data }));
  }

  private handleUserTyping(data: TypingData) {
    window.dispatchEvent(new CustomEvent('userTypingMessage', { detail: data }));
  }

  private handleUserStoppedTyping(data: { userId: string }) {
    window.dispatchEvent(new CustomEvent('userStoppedTypingMessage', { detail: data }));
  }

  private handleOnlineStatus(data: OnlineStatusData) {
    window.dispatchEvent(new CustomEvent('userOnlineStatus', { detail: data }));
  }

  onNewMessage(callback: (data: MessageData) => void) {
    const handler = (event: CustomEvent) => callback(event.detail);
    window.addEventListener('newMessage', handler as EventListener);
    return () => window.removeEventListener('newMessage', handler as EventListener);
  }

  onMessageSent(callback: (data: { messageId: string }) => void) {
    const handler = (event: CustomEvent) => callback(event.detail);
    window.addEventListener('messageSent', handler as EventListener);
    return () => window.removeEventListener('messageSent', handler as EventListener);
  }

  onMessageError(callback: (data: { error: string }) => void) {
    const handler = (event: CustomEvent) => callback(event.detail);
    window.addEventListener('messageError', handler as EventListener);
    return () => window.removeEventListener('messageError', handler as EventListener);
  }

  onMessageRead(callback: (data: { messageId: string }) => void) {
    const handler = (event: CustomEvent) => callback(event.detail);
    window.addEventListener('messageRead', handler as EventListener);
    return () => window.removeEventListener('messageRead', handler as EventListener);
  }

  onUserTyping(callback: (data: TypingData) => void) {
    const handler = (event: CustomEvent) => callback(event.detail);
    window.addEventListener('userTypingMessage', handler as EventListener);
    return () => window.removeEventListener('userTypingMessage', handler as EventListener);
  }

  onUserStoppedTyping(callback: (data: { userId: string }) => void) {
    const handler = (event: CustomEvent) => callback(event.detail);
    window.addEventListener('userStoppedTypingMessage', handler as EventListener);
    return () => window.removeEventListener('userStoppedTypingMessage', handler as EventListener);
  }

  onUserOnlineStatus(callback: (data: OnlineStatusData) => void) {
    const handler = (event: CustomEvent) => callback(event.detail);
    window.addEventListener('userOnlineStatus', handler as EventListener);
    return () => window.removeEventListener('userOnlineStatus', handler as EventListener);
  }

  cleanup() {
    this.typingTimeouts.forEach(timeout => clearTimeout(timeout));
    this.typingTimeouts.clear();

    // Remove socket listeners
    socket.off('newMessage');
    socket.off('messageSent');
    socket.off('messageError');
    socket.off('messageRead');
    socket.off('userTypingMessage');
    socket.off('userStoppedTypingMessage');
    socket.off('userOnlineStatus');
  }
}

export const messageSocketService = new MessageSocketService();
