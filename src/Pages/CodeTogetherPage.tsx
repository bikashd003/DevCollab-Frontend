import { motion } from 'framer-motion';
import { FaMicrophone, FaMicrophoneSlash, FaCog } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { useTheme } from '../Context/ThemeProvider';
import { useState } from 'react';
import CollaborativeEditor from './CollaborativeEditor';
// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { useSubscription } from '@apollo/client';
// import { GET_USERS, GET_MESSAGES } from '../Graphql/Queries';
// import { SOCKET_EVENTS } from '../Utils/Constants';
// import { useSocket } from '../Contexts/SocketContext';

const CodeTogetherPage = () => {
  const [isMuted, setIsMuted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [messages, setMessages] = useState<Array<{ id: number; user: string; text: string }>>([]);
  const [newMessage, setNewMessage] = useState('');

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessages([...messages, { id: Date.now(), user: 'You', text: newMessage }]);
    setNewMessage('');
  };
  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 ml-16">
      <header className="bg-indigo-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Collaborative Coding Platform</h1>
        <div className="flex items-center space-x-4">
          {[
            {
              id: 1,
              name: 'Alice',
              avatar:
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
              status: 'online',
            },
            {
              id: 2,
              name: 'Bob',
              avatar:
                'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
              status: 'away',
            },
            {
              id: 3,
              name: 'Charlie',
              avatar:
                'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
              status: 'offline',
            },
          ].map(user => (
            <motion.div
              key={user.id}
              className="relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${user.status === 'online' ? 'bg-green-500' : user.status === 'away' ? 'bg-yellow-500' : 'bg-red-500'}`}
              ></span>
            </motion.div>
          ))}
          <motion.button
            className="p-2 rounded-full bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={toggleMute}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
          </motion.button>
          <motion.button
            className="p-2 rounded-full bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaCog />
          </motion.button>
        </div>
      </header>
      <main className="flex-grow flex overflow-hidden">
        <div className="w-2/3 p-4">
          <CollaborativeEditor />
        </div>
        <div className="w-1/3 p-4 flex flex-col bg-white dark:bg-gray-800 shadow-lg">
          <div className="flex-grow overflow-y-auto mb-4">
            {messages.map((message: { id: number; user: string; text: string }) => (
              <motion.div
                key={message.id}
                className={`mb-2 p-2 rounded ${message.user === 'You' ? 'bg-indigo-100 dark:bg-indigo-900 ml-auto' : 'bg-gray-100 dark:bg-gray-700'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="font-semibold">{message.user}</p>
                <p>{message.text}</p>
              </motion.div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <motion.button
              type="submit"
              className="bg-indigo-600 text-white p-2 rounded-r hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IoMdSend />
            </motion.button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CodeTogetherPage;
