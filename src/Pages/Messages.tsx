import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Search, Users } from 'lucide-react';
import { Input, Button } from '@nextui-org/react';

const Messages: React.FC = () => {
  return (
    <div className="min-h-screen ml-16 lg:ml-64 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Messages</h1>
              <p className="text-slate-400">Connect with fellow developers</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Conversations</h2>
            </div>

            {/* Search */}
            <div className="mb-4">
              <Input
                placeholder="Search conversations..."
                startContent={<Search className="w-4 h-4 text-slate-400" />}
                classNames={{
                  input: 'bg-slate-700/50 text-white placeholder:text-slate-400',
                  inputWrapper:
                    'bg-slate-700/50 border-slate-600 hover:border-slate-500 focus-within:border-blue-500',
                }}
              />
            </div>

            {/* Conversation List */}
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="p-3 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 rounded-xl cursor-pointer transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">U{i}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">User {i}</h3>
                      <p className="text-slate-400 text-sm truncate">Last message preview...</p>
                    </div>
                    <div className="text-xs text-slate-500">2m</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden"
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">U1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">User 1</h3>
                  <p className="text-slate-400 text-sm">Online</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 h-96 overflow-y-auto space-y-4">
              {/* Received Message */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-xs">U1</span>
                </div>
                <div className="bg-slate-700/50 p-3 rounded-xl max-w-xs">
                  <p className="text-white text-sm">Hey! How's your project coming along?</p>
                  <span className="text-slate-400 text-xs">2:30 PM</span>
                </div>
              </div>

              {/* Sent Message */}
              <div className="flex items-start gap-3 justify-end">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl max-w-xs">
                  <p className="text-white text-sm">
                    Great! Just finished the authentication system.
                  </p>
                  <span className="text-blue-100 text-xs">2:32 PM</span>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-slate-700/50">
              <div className="flex gap-3">
                <Input
                  placeholder="Type a message..."
                  className="flex-1"
                  classNames={{
                    input: 'bg-slate-700/50 text-white placeholder:text-slate-400',
                    inputWrapper:
                      'bg-slate-700/50 border-slate-600 hover:border-slate-500 focus-within:border-blue-500',
                  }}
                />
                <Button
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                  isIconOnly
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
