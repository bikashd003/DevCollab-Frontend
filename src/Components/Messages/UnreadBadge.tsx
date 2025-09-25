import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_UNREAD_MESSAGES_COUNT } from '../../GraphQL/Queries/Messages/Messages';

interface UnreadBadgeProps {
  className?: string;
}

const UnreadBadge: React.FC<UnreadBadgeProps> = ({ className = '' }) => {
  const { data, loading } = useQuery(GET_UNREAD_MESSAGES_COUNT, {
    pollInterval: 30000, // Poll every 30 seconds
    errorPolicy: 'ignore',
  });

  const unreadCount = data?.getUnreadMessagesCount || 0;

  if (loading || unreadCount === 0) {
    return null;
  }

  return (
    <span
      className={`bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center ${className}`}
    >
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  );
};

export default UnreadBadge;
