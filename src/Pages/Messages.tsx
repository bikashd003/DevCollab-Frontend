import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Send, Search, Users, MessageCircle, Plus } from 'lucide-react';
import { Input, Button, Avatar, Spinner } from '@nextui-org/react';
import { useQuery, useMutation } from '@apollo/client';
import { message } from 'antd';
import PageContainer from '../Components/Profile/PageContainer';
import ConnectionsList from '../Components/Messages/ConnectionsList';
import type { MessageData, TypingData } from '../Services/MessageSocket';
import { useMessageSocket } from '../Hooks/useMessageSocket';
import {
  GET_CONVERSATIONS,
  GET_MESSAGES,
  GET_USER_CONNECTIONS,
} from '../GraphQL/Queries/Messages/Messages';
import { GET_CURRENT_USER_ID } from '../GraphQL/Queries/Profile/Users';
import { SEND_MESSAGE, MARK_CONVERSATION_AS_READ } from '../GraphQL/Mutations/Messages/Messages';
import EmptyState from '../Components/Questions/EmptyState';

interface User {
  id: string;
  username: string;
  profilePicture?: string;
  isOnline?: boolean;
  lastOnline?: string;
}

interface Message {
  id: string;
  sender: User;
  receiver: User;
  content: string;
  messageType: string;
  isRead: boolean;
  createdAt: string;
}

interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  lastMessageAt: string;
  unreadCount: number;
  isActive: boolean;
}

const Messages: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConnectionsList, setShowConnectionsList] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [isMobileView, setIsMobileView] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: currentUserData } = useQuery(GET_CURRENT_USER_ID);
  const {
    data: conversationsData,
    loading: conversationsLoading,
    refetch: refetchConversations,
  } = useQuery(GET_CONVERSATIONS);
  const { data: connectionsData } = useQuery(GET_USER_CONNECTIONS);
  const {
    data: messagesData,
    loading: messagesLoading,
    refetch: refetchMessages,
  } = useQuery(GET_MESSAGES, {
    variables: { conversationId: selectedConversation?.id },
    skip: !selectedConversation?.id,
  });

  const [sendMessage, { loading: sendingMessage }] = useMutation(SEND_MESSAGE);
  const [markConversationAsRead] = useMutation(MARK_CONVERSATION_AS_READ);

  const conversations = conversationsData?.getConversations || [];
  const messages = useMemo(() => messagesData?.getMessages || [], [messagesData?.getMessages]);
  const connections = connectionsData?.user?.connections || [];
  const currentUserId = currentUserData?.getCurrentUserId;

  useEffect(() => {
    if (connectionsData?.user?.connections?.length > 0) {
      const initialOnlineUsers = new Set<string>(
        connectionsData.user.connections
          .filter((conn: User) => conn.isOnline)
          .map((conn: User) => conn.id as string)
      );
      setOnlineUsers(initialOnlineUsers);
    }
  }, [connectionsData?.user?.connections]);

  const {
    sendMessage: sendSocketMessage,
    startTyping,
    autoStopTyping,
  } = useMessageSocket({
    currentUserId,
    onNewMessage: (_data: MessageData) => {
      refetchConversations();
      if (selectedConversation) {
        refetchMessages();
      }
    },
    onMessageSent: () => {
      refetchMessages();
      refetchConversations();
    },
    onMessageError: (error: string) => {
      message.error(error);
    },
    onUserTyping: (_data: TypingData) => {
      if (selectedConversation) {
        const otherParticipant = getOtherParticipant(selectedConversation);
        if (otherParticipant?.id === _data.userId) {
          setTypingUsers(prev => new Set(prev).add(_data.userId));
        }
      }
    },
    onUserStoppedTyping: _data => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(_data.userId);
        return newSet;
      });
    },
    onUserOnlineStatus: _data => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        if (_data.isOnline) {
          newSet.add(_data.userId);
        } else {
          newSet.delete(_data.userId);
        }
        return newSet;
      });
      refetchConversations();
    },
  });

  const filteredConversations = conversations.filter((conv: Conversation) =>
    conv.participants.some(
      p => p.id !== currentUserId && p.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (selectedConversation && selectedConversation.unreadCount > 0) {
      markConversationAsRead({
        variables: { conversationId: selectedConversation.id },
      });
    }
  }, [selectedConversation, markConversationAsRead]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    const otherParticipant = selectedConversation.participants.find(p => p.id !== currentUserId);
    if (!otherParticipant) return;

    try {
      const { data: messageData } = await sendMessage({
        variables: {
          input: {
            receiverId: otherParticipant.id,
            content: messageText.trim(),
            messageType: 'text',
          },
        },
      });

      if (messageData?.sendMessage) {
        sendSocketMessage(otherParticipant.id, {
          id: messageData.sendMessage.id,
          content: messageData.sendMessage.content,
          createdAt: messageData.sendMessage.createdAt,
          conversationId: selectedConversation.id,
        });
      }

      setMessageText('');
      refetchMessages();
      refetchConversations();
    } catch (error) {
      message.error('Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);

    if (selectedConversation) {
      const otherParticipant = getOtherParticipant(selectedConversation);
      if (otherParticipant) {
        startTyping(otherParticipant.id);
        autoStopTyping(otherParticipant.id);
      }
    }
  };

  const formatTime = (dateString: string) => {
    const timestamp = typeof dateString === 'string' ? parseInt(dateString) : dateString;
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p.id !== currentUserId);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectConversationMobile = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowConnectionsList(false);
  };

  return (
    <PageContainer>
      <div className="h-[calc(100vh-8rem)] flex bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className={`${
            isMobileView && selectedConversation ? 'hidden' : 'flex'
          } flex-col w-full lg:w-80 xl:w-96 border-r border-slate-700/50 bg-slate-800/30`}
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Messages</h2>
            </div>
            <Button
              size="sm"
              onClick={() => setShowConnectionsList(!showConnectionsList)}
              className="bg-blue-500 hover:bg-blue-600 text-white min-w-0"
              startContent={<Plus className="w-4 h-4" />}
            >
              {isMobileView ? '' : 'New'}
            </Button>
          </div>

          <div className="p-4 border-b border-slate-700/50">
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              startContent={<Search className="w-4 h-4 text-slate-400" />}
              classNames={{
                input: 'bg-slate-700/50 text-white placeholder:text-slate-400',
                inputWrapper:
                  'bg-slate-700/50 border-slate-600 hover:border-slate-500 focus-within:border-blue-500',
              }}
            />
          </div>

          {showConnectionsList && (
            <div className="border-b border-slate-700/50">
              <ConnectionsList
                onSelectConnection={handleSelectConversationMobile}
                currentUserId={currentUserId}
                onlineUsers={onlineUsers}
              />
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-2">
              {conversationsLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="sm" color="primary" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-4">
                  <EmptyState
                    type={connections.length === 0 ? 'no-connections' : 'no-conversations'}
                    onStartNewConversation={() => setShowConnectionsList(true)}
                  />
                </div>
              ) : (
                filteredConversations.map((conversation: Conversation) => {
                  const otherParticipant = getOtherParticipant(conversation);
                  if (!otherParticipant) return null;

                  return (
                    <motion.div
                      key={conversation.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleSelectConversationMobile(conversation)}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedConversation?.id === conversation.id
                          ? 'bg-blue-500/20 border border-blue-500/50'
                          : 'bg-slate-700/30 hover:bg-slate-700/50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <Avatar
                            src={otherParticipant.profilePicture}
                            name={otherParticipant.username}
                            size="md"
                            className="w-12 h-12"
                          />
                          {(otherParticipant.isOnline || onlineUsers.has(otherParticipant.id)) && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-white truncate">
                              {otherParticipant.username}
                            </h3>
                            <div className="flex items-center gap-2">
                              {conversation.unreadCount > 0 && (
                                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-medium">
                                  {conversation.unreadCount}
                                </span>
                              )}
                              <span className="text-xs text-slate-500 flex-shrink-0">
                                {formatTime(conversation.lastMessageAt)}
                              </span>
                            </div>
                          </div>
                          <p className="text-slate-400 text-sm truncate">
                            {conversation.lastMessage?.content || 'Start a conversation...'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`${
            isMobileView && !selectedConversation ? 'hidden' : 'flex'
          } flex-1 flex flex-col bg-slate-800/30`}
        >
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
                <div className="flex items-center gap-4">
                  {isMobileView && (
                    <Button
                      isIconOnly
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedConversation(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      ←
                    </Button>
                  )}
                  {(() => {
                    const otherParticipant = getOtherParticipant(selectedConversation);
                    return (
                      <>
                        <div className="relative">
                          <Avatar
                            src={otherParticipant?.profilePicture}
                            name={otherParticipant?.username}
                            size="md"
                            className="w-10 h-10"
                          />
                          {(otherParticipant?.isOnline ||
                            onlineUsers.has(otherParticipant?.id || '')) && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-lg">
                            {otherParticipant?.username}
                          </h3>
                          <p className="text-slate-400 text-sm">
                            {otherParticipant?.isOnline ||
                            onlineUsers.has(otherParticipant?.id || '') ? (
                              <span className="text-green-400">● Online</span>
                            ) : (
                              'Offline'
                            )}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto min-h-0">
                {messagesLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="lg" color="primary" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                      <MessageCircle className="w-8 h-8 text-slate-500" />
                    </div>
                    <h3 className="text-slate-300 text-lg font-medium mb-2">No messages yet</h3>
                    <p className="text-slate-500 text-sm max-w-sm">
                      Start the conversation by sending a message below
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {messages.map((msg: Message) => {
                      const isOwnMessage = msg.sender.id === currentUserId;
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex items-end gap-3 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isOwnMessage && (
                            <Avatar
                              src={msg.sender.profilePicture}
                              name={msg.sender.username}
                              size="sm"
                              className="w-8 h-8 mb-1"
                            />
                          )}
                          <div
                            className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}
                          >
                            <div
                              className={`px-4 py-3 rounded-2xl max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg ${
                                isOwnMessage
                                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                                  : 'bg-slate-700/70 text-white rounded-bl-md'
                              }`}
                            >
                              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                {msg.content}
                              </p>
                            </div>
                            <span
                              className={`text-xs mt-1 px-1 ${
                                isOwnMessage ? 'text-blue-300' : 'text-slate-500'
                              }`}
                            >
                              {formatTime(msg.createdAt)}
                            </span>
                          </div>
                          {isOwnMessage && (
                            <Avatar
                              src={msg.sender.profilePicture}
                              name={msg.sender.username}
                              size="sm"
                              className="w-8 h-8 mb-1"
                            />
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {typingUsers.size > 0 && selectedConversation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-end gap-3 mt-4"
                  >
                    {(() => {
                      const otherParticipant = getOtherParticipant(selectedConversation);
                      return typingUsers.has(otherParticipant?.id || '') ? (
                        <>
                          <Avatar
                            src={otherParticipant?.profilePicture}
                            name={otherParticipant?.username}
                            size="sm"
                            className="w-8 h-8 mb-1"
                          />
                          <div className="bg-slate-700/70 px-4 py-3 rounded-2xl rounded-bl-md">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                style={{ animationDelay: '0.1s' }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                                style={{ animationDelay: '0.2s' }}
                              ></div>
                            </div>
                          </div>
                        </>
                      ) : null;
                    })()}
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-6 border-t border-slate-700/50 bg-slate-800/30">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <Input
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyPress}
                      size="lg"
                      classNames={{
                        input: 'bg-slate-700/50 text-white placeholder:text-slate-400 text-base',
                        inputWrapper:
                          'bg-slate-700/50 border-slate-600 hover:border-slate-500 focus-within:border-blue-500 min-h-[48px]',
                      }}
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sendingMessage}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white min-w-[48px] h-12"
                    isIconOnly
                  >
                    {sendingMessage ? (
                      <Spinner size="sm" color="white" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-slate-700/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-10 h-10 text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-300 mb-3">
                  {isMobileView ? 'Select a conversation' : 'Welcome to Messages'}
                </h3>
                <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                  {isMobileView
                    ? 'Choose a conversation from the list to start messaging'
                    : 'Select a conversation from the sidebar or start a new one to begin messaging with your connections'}
                </p>
                {!isMobileView && (
                  <Button
                    onClick={() => setShowConnectionsList(true)}
                    className="mt-6 bg-blue-500 hover:bg-blue-600 text-white"
                    startContent={<Plus className="w-4 h-4" />}
                  >
                    Start New Conversation
                  </Button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </PageContainer>
  );
};

export default Messages;
