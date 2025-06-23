import { motion, AnimatePresence } from 'framer-motion';
import { IoMdSend } from 'react-icons/io';
import { useState, useEffect, useRef } from 'react';
import CollaborativeEditor from './CollaborativeEditor';
import { useParams } from 'react-router-dom';
import {
  Share,
  Users,
  Settings,
  Maximize2,
  Minimize2,
  MessageCircle,
  X,
  Bell,
  BellOff,
  Code,
} from 'lucide-react';
import { socket } from '../Utilities/Socket';
import { Avatar, message, Tooltip } from 'antd';
import { useAuth } from '../Secure/AuthContext';

const CodeTogetherPage = () => {
  const [messages, setMessages] = useState<
    Array<{
      username: { _id: string; username: string };
      message: string;
      timestamp: Date;
    }>
  >([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<
    Array<{ username: string; profilePicture: string }>
  >([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const { id } = useParams();
  const [shareableLink, setShareableLink] = useState('');
  const { currentUserId } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle responsive sidebar collapse for mobile
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsSidebarCollapsed(true);
    } else {
      setIsSidebarCollapsed(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.innerWidth]);

  // Socket connection and event management
  useEffect(() => {
    socket.connect();

    if (id && currentUserId) {
      socket.emit('joinProject', { projectId: id, userId: currentUserId });
      setShareableLink(`${window.location.origin}/editor/${id}`);
    }

    // Listen for real-time messages
    socket.on('chatMessage', message => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('userTyping', (username: string) => {
      setTypingUsers(prev => [...new Set([...prev, username])]);
    });

    socket.on('userStoppedTyping', (username: string) => {
      setTypingUsers(prev => prev.filter(user => user !== username));
    });

    // Update the list of connected users
    socket.on('connectedUsers', users => {
      setConnectedUsers(users);
      message.success(`${users.length} users connected`);
    });

    socket.on('chatHistory', history => {
      if (history && history.chatHistory) {
        setMessages(history.chatHistory);
      }
    });

    return () => {
      socket.off('chatMessage');
      socket.off('connectedUsers');
      socket.off('chatHistory');
      socket.off('userTyping');
      socket.off('userStoppedTyping');
      socket.disconnect();
    };
  }, [currentUserId, id]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent) => {
    if ('preventDefault' in e) {
      e.preventDefault();
    }
    if ('key' in e && e.key !== 'Enter') return;
    if (!newMessage.trim()) return;

    const messageData = {
      user: currentUserId,
      text: newMessage.trim(),
    };

    socket.emit('chatMessage', {
      projectId: id,
      ...messageData,
    });

    setNewMessage('');
  };

  let typingTimeout: ReturnType<typeof setTimeout>;
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    // Emit typing event
    socket.emit('typing', { projectId: id });

    // Clear existing timeout
    clearTimeout(typingTimeout);

    // Set new timeout to emit stopped typing
    typingTimeout = setTimeout(() => {
      socket.emit('stopTyping', { projectId: id });
    }, 1000);
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(shareableLink);
    message.success('Link copied to clipboard!');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* Modern Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Code size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">CodeTogether</h1>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span>Live Session</span>
                <span>•</span>
                <span>Auto-saved</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Connected Users Display */}
          <Tooltip title={`${connectedUsers.length} connected users`}>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="flex -space-x-2">
                {connectedUsers.slice(0, 4).map(user => (
                  <Tooltip key={user.username} title={user.username}>
                    {user.profilePicture ? (
                      <Avatar
                        size={24}
                        src={user.profilePicture}
                        className="border-2 border-white dark:border-gray-700"
                      />
                    ) : (
                      <Avatar
                        size={24}
                        className="bg-gradient-to-br from-blue-400 to-indigo-500 border-2 border-white dark:border-gray-700 text-white font-medium"
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </Avatar>
                    )}
                  </Tooltip>
                ))}
                {connectedUsers.length > 4 && (
                  <Tooltip title={`${connectedUsers.length - 4} more users`}>
                    <Avatar
                      size={24}
                      className="bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-700"
                    >
                      +{connectedUsers.length - 4}
                    </Avatar>
                  </Tooltip>
                )}
              </div>
              <Users size={14} className="text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {connectedUsers.length}
              </span>
            </div>
          </Tooltip>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <Tooltip title={notifications ? 'Disable notifications' : 'Enable notifications'}>
              <motion.button
                onClick={() => setNotifications(!notifications)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {notifications ? <Bell size={16} /> : <BellOff size={16} />}
              </motion.button>
            </Tooltip>

            <Tooltip title="Share session">
              <motion.button
                onClick={handleShareLink}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share size={16} />
              </motion.button>
            </Tooltip>

            <Tooltip title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
              <motion.button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </motion.button>
            </Tooltip>

            <Tooltip title="Settings">
              <motion.button
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings size={16} />
              </motion.button>
            </Tooltip>
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Editor Section */}
        <div
          className={`transition-all duration-300 ${isSidebarCollapsed ? 'w-full' : 'w-full lg:w-3/4'} flex flex-col`}
        >
          {/* Collaborative Editor */}
          <div className="flex-1 bg-white dark:bg-gray-800 overflow-hidden">
            <CollaborativeEditor
              projectId={id}
              userId={currentUserId}
              socket={socket}
              username={''}
            />
          </div>
        </div>

        {/* Sidebar Section */}
        <AnimatePresence>
          {!isSidebarCollapsed && (
            <motion.div
              className="w-1/4 min-w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setActiveTab('chat')}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'chat'
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Chat
                    </button>
                    <button
                      onClick={() => setActiveTab('users')}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'users'
                          ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      Users ({connectedUsers.length})
                    </button>
                  </div>
                </div>
                <Tooltip title="Close sidebar">
                  <motion.button
                    onClick={toggleSidebar}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X size={16} />
                  </motion.button>
                </Tooltip>
              </div>

              {/* Chat Tab */}
              {activeTab === 'chat' && (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                    {messages.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <MessageCircle
                          size={32}
                          className="text-gray-400 dark:text-gray-600 mb-2"
                        />
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No messages yet</p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                          Start collaborating with your team
                        </p>
                      </div>
                    )}

                    {messages.map((msg, index) => (
                      <motion.div
                        key={`${msg.username._id}-${index}`}
                        className={`max-w-[85%] ${msg.username._id === currentUserId ? 'ml-auto' : ''}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div
                          className={`p-3 rounded-2xl ${
                            msg.username._id === currentUserId
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium opacity-80">
                              {msg.username.username}
                            </p>
                            <p className="text-xs opacity-60">
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </motion.div>
                    ))}

                    {typingUsers.length > 0 && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 italic flex items-center gap-2">
                        <div className="flex space-x-1">
                          <span
                            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                            style={{ animationDelay: '0ms' }}
                          ></span>
                          <span
                            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                            style={{ animationDelay: '200ms' }}
                          ></span>
                          <span
                            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                            style={{ animationDelay: '400ms' }}
                          ></span>
                        </div>
                        {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={handleTyping}
                        onKeyPress={e => handleSendMessage(e)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 rounded-full bg-gray-100 dark:bg-gray-700 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all text-sm"
                      />
                      <motion.button
                        onClick={e => handleSendMessage(e as any)}
                        className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!newMessage.trim()}
                      >
                        <IoMdSend className="text-lg" />
                      </motion.button>
                    </div>
                  </div>
                </>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="flex-1 p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Connected Users
                      </h3>
                      <Tooltip title="Copy share link">
                        <Share
                          size={16}
                          className="cursor-pointer text-gray-500 hover:text-blue-500 transition-colors"
                          onClick={handleShareLink}
                        />
                      </Tooltip>
                    </div>

                    {connectedUsers.map((user, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="relative">
                          {user.profilePicture ? (
                            <Avatar size={32} src={user.profilePicture} />
                          ) : (
                            <Avatar
                              size={32}
                              className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white font-medium"
                            >
                              {user.username.charAt(0).toUpperCase()}
                            </Avatar>
                          )}
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.username}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Chat Toggle */}
        {isSidebarCollapsed && (
          <motion.button
            onClick={toggleSidebar}
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg z-50 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="relative">
              <Users size={18} />
              {connectedUsers.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center text-xs bg-red-500 text-white rounded-full">
                  {connectedUsers.length}
                </span>
              )}
            </div>
          </motion.button>
        )}
      </main>
    </div>
  );
};

export default CodeTogetherPage;
