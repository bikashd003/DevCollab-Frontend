import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MessageCircle, Users } from 'lucide-react';
import { Input, Avatar } from '@nextui-org/react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_USER_CONNECTIONS, GET_CONVERSATION } from '../../GraphQL/Queries/Messages/Messages';
import { toast } from 'sonner';

interface User {
  id: string;
  username: string;
  profilePicture?: string;
  isOnline?: boolean;
  lastOnline?: string;
}

interface ConnectionsListProps {
  onSelectConnection: (conversation: any) => void;
  currentUserId?: string;
  onlineUsers?: Set<string>;
}

const ConnectionsList: React.FC<ConnectionsListProps> = ({
  onSelectConnection,
  onlineUsers = new Set(),
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: connectionsData, loading } = useQuery(GET_USER_CONNECTIONS);
  const [getConversation] = useLazyQuery(GET_CONVERSATION);

  const connections = connectionsData?.user?.connections || [];

  const filteredConnections = connections.filter((connection: User) =>
    connection.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartConversation = async (connection: User) => {
    try {
      const { data } = await getConversation({
        variables: { participantId: connection.id },
      });

      if (data?.getConversation) {
        onSelectConnection(data.getConversation);
      }
    } catch (error: any) {
      toast.error('Error starting conversation:', error);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <Users className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-white">Start New Conversation</h3>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search connections..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          startContent={<Search className="w-4 h-4 text-slate-400" />}
          size="sm"
          classNames={{
            input: 'bg-slate-700/50 text-white placeholder:text-slate-400',
            inputWrapper:
              'bg-slate-700/50 border-slate-600 hover:border-slate-500 focus-within:border-blue-500',
          }}
        />
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {loading ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : filteredConnections.length === 0 ? (
          <div className="text-center py-6">
            <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">
              {searchTerm ? 'No connections found' : 'No connections yet'}
            </p>
          </div>
        ) : (
          filteredConnections.map((connection: User) => (
            <motion.div
              key={connection.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg transition-all duration-200 cursor-pointer"
              onClick={() => handleStartConversation(connection)}
            >
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <Avatar
                    src={connection.profilePicture}
                    name={connection.username}
                    size="sm"
                    className="w-9 h-9"
                  />
                  {(connection.isOnline || onlineUsers.has(connection.id)) && (
                    <div className="w-3 h-3 bg-green-500 rounded-full absolute -bottom-0.5 -right-0.5 border-2 border-slate-800"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white text-sm truncate">{connection.username}</h3>
                  <p className="text-slate-400 text-xs">
                    {connection.isOnline || onlineUsers.has(connection.id) ? (
                      <span className="text-green-400">● Online</span>
                    ) : (
                      'Offline'
                    )}
                  </p>
                </div>
                <MessageCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default ConnectionsList;
