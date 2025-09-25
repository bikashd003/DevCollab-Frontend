import React from 'react';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiPlus, FiSearch, FiUsers } from 'react-icons/fi';
import { Button } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, UserPlus, Users } from 'lucide-react';

interface EmptyStateProps {
  type:
    | 'no-questions'
    | 'no-search-results'
    | 'error'
    | 'no-conversations'
    | 'no-connections'
    | 'select-conversation';
  searchTerm?: string;
  onRetry?: () => void;
  onStartNewConversation?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  searchTerm,
  onRetry,
  onStartNewConversation,
}) => {
  const navigate = useNavigate();

  const getEmptyStateContent = () => {
    switch (type) {
      case 'no-questions':
        return {
          icon: <FiMessageSquare className="w-16 h-16 text-theme-muted" />,
          title: 'No Questions Yet',
          description: 'Be the first to ask a question and start the conversation!',
          primaryAction: {
            label: 'Ask First Question',
            onClick: () => navigate('/questions/ask'),
            icon: <FiPlus className="w-4 h-4" />,
          },
          secondaryAction: {
            label: 'Browse Community',
            onClick: () => navigate('/community'),
            icon: <FiUsers className="w-4 h-4" />,
          },
        };

      case 'no-search-results':
        return {
          icon: <FiSearch className="w-16 h-16 text-theme-muted" />,
          title: 'No Results Found',
          description: searchTerm
            ? `No questions found for "${searchTerm}". Try different keywords or ask a new question.`
            : 'No questions match your search criteria.',
          primaryAction: {
            label: 'Ask Question',
            onClick: () => navigate('/questions/ask'),
            icon: <FiPlus className="w-4 h-4" />,
          },
          secondaryAction: {
            label: 'Clear Search',
            onClick: () => window.location.reload(),
            icon: <FiSearch className="w-4 h-4" />,
          },
        };

      case 'error':
        return {
          icon: <div className="w-16 h-16 text-red-500 text-4xl">⚠️</div>,
          title: 'Something Went Wrong',
          description: 'We encountered an error while loading questions. Please try again.',
          primaryAction: {
            label: 'Try Again',
            onClick: onRetry || (() => window.location.reload()),
            icon: <div className="w-4 h-4">🔄</div>,
          },
          secondaryAction: {
            label: 'Go Home',
            onClick: () => navigate('/'),
            icon: <div className="w-4 h-4">🏠</div>,
          },
        };

      case 'no-connections':
        return {
          icon: <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />,
          title: 'No connections yet',
          description: 'Connect with other developers to start messaging',
          action: (
            <Button
              onClick={() => navigate('/profile')}
              className="bg-blue-500 hover:bg-blue-600 text-white mt-4"
              startContent={<UserPlus className="w-4 h-4" />}
            >
              Find Developers
            </Button>
          ),
        };

      case 'no-conversations':
        return {
          icon: <MessageCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />,
          title: 'No conversations yet',
          description: 'Start messaging your connections to collaborate on projects',
          action: onStartNewConversation && (
            <Button
              onClick={onStartNewConversation}
              className="bg-blue-500 hover:bg-blue-600 text-white mt-4"
              startContent={<MessageCircle className="w-4 h-4" />}
            >
              Start Conversation
            </Button>
          ),
        };

      case 'select-conversation':
        return {
          icon: <MessageCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />,
          title: 'Select a conversation',
          description: 'Choose a conversation from the list to start messaging',
          action: null,
        };

      default:
        return {
          icon: <FiMessageSquare className="w-16 h-16 text-theme-muted" />,
          title: 'No Content',
          description: 'Nothing to show here.',
          primaryAction: null,
          secondaryAction: null,
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-8 text-center"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        {content.icon}
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl font-bold text-theme-primary mb-3"
      >
        {content.title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-theme-secondary max-w-md mb-8 leading-relaxed"
      >
        {content.description}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        {content.primaryAction && (
          <Button
            onClick={content.primaryAction.onClick}
            className="bg-theme-accent text-white hover:bg-theme-accent/90 px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-theme-md hover:shadow-theme-lg transform hover:-translate-y-0.5"
            startContent={content.primaryAction.icon}
          >
            {content.primaryAction.label}
          </Button>
        )}

        {content.secondaryAction && (
          <Button
            onClick={content.secondaryAction.onClick}
            variant="bordered"
            className="border-theme-primary text-theme-primary hover:bg-theme-secondary px-6 py-3 rounded-lg font-medium transition-all duration-300"
            startContent={content.secondaryAction.icon}
          >
            {content.secondaryAction.label}
          </Button>
        )}
      </motion.div>

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-theme-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-theme-accent/3 rounded-full blur-3xl"></div>
      </div>
    </motion.div>
  );
};

export default EmptyState;
