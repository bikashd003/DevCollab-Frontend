import { motion } from 'framer-motion';
import { IoMdSend } from 'react-icons/io';
import { useState, useEffect, useRef } from 'react';
import CollaborativeEditor from './CollaborativeEditor';
import { useParams } from 'react-router-dom';
import { Share } from 'lucide-react';
import { socket } from '../Utilities/Socket';
import { Avatar, message } from 'antd';
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
  >([]); // Real-time connected users
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
  // Initialize socket and manage real-time events
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

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      user: currentUserId,
      text: newMessage.trim(),
    };

    socket.emit('chatMessage', {
      projectId: id,
      ...message,
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
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <main className="flex-grow flex flex-col lg:flex-row overflow-hidden p-4 gap-4">
        {/* Editor Section */}
        <div className="w-full lg:w-2/3 rounded-2xl backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 shadow-xl">
          <CollaborativeEditor />
        </div>

        {/* Sidebar Section */}
        <div className="w-full lg:w-1/3 flex flex-col rounded-2xl backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl">
          {/* Chat Section */}
          <div className="p-4 border-b flex gap-2 justify-between border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">Chat</h2>
              {connectedUsers?.map(user => (
                <Avatar.Group key={user?.username}>
                  {user?.profilePicture ? (
                    <Avatar size={28} src={user?.profilePicture} />
                  ) : (
                    <Avatar size={28}>{user?.username?.charAt(0).toUpperCase()}</Avatar>
                  )}
                </Avatar.Group>
              ))}
            </div>
            <Share
              className="cursor-pointer"
              onClick={() => navigator.clipboard.writeText(shareableLink)}
            />
          </div>
          <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scroll-smooth">
            {messages?.map(
              (message: {
                username: { _id: string; username: string };
                message: string;
                timestamp: Date;
              }) => (
                <motion.div
                  key={message?.username?._id}
                  className={`max-w-[80%] ${message?.username?._id === currentUserId ? 'ml-auto' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`p-3 rounded-2xl ${
                      message?.username?._id === currentUserId
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <p className="text-sm font-medium mb-1">{message?.username?.username}</p>
                    <p className="text-sm">{message?.message}</p>
                  </div>
                </motion.div>
              )
            )}
            {typingUsers.length > 0 && (
              <div className="text-sm text-gray-500 italic">
                {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={handleTyping}
                placeholder="Type a message..."
                className="flex-grow px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
              />
              <motion.button
                type="submit"
                className="p-3 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg hover:shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IoMdSend className="text-lg" />
              </motion.button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CodeTogetherPage;
