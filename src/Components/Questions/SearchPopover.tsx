import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiTag, FiUser, FiType } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: string;
  title: string;
  upvotes: { id: string }[];
  downvotes: { id: string }[];
  tags: string[];
  author: {
    username: string;
    profilePicture: string;
  };
  createdAt: string;
}

interface SearchPopoverContentProps {
  searchResults: Question[];
  isLoading?: boolean;
}

const SearchPopoverContent: React.FC<SearchPopoverContentProps> = ({
  searchResults,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  const searchTips = [
    {
      icon: <FiTag className="w-4 h-4" />,
      syntax: '[tag]',
      description: 'search by tag',
      color: 'blue',
      example: '[react]',
    },
    {
      icon: <FiUser className="w-4 h-4" />,
      syntax: 'user:username',
      description: 'search by user',
      color: 'green',
      example: 'user:john',
    },
    {
      icon: <FiType className="w-4 h-4" />,
      syntax: 'title keywords',
      description: 'search by title',
      color: 'purple',
      example: 'react hooks',
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          dot: 'bg-blue-500',
          text: 'text-blue-600 dark:text-blue-400',
        };
      case 'green':
        return {
          dot: 'bg-green-500',
          text: 'text-green-600 dark:text-green-400',
        };
      case 'purple':
        return {
          dot: 'bg-purple-500',
          text: 'text-purple-600 dark:text-purple-400',
        };
      default:
        return {
          dot: 'bg-gray-500',
          text: 'text-gray-600 dark:text-gray-400',
        };
    }
  };

  return (
    <div className="min-w-[400px] max-w-[600px] p-5">
      {searchResults.length === 0 && !isLoading ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <FiSearch className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Search Tips</h4>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {searchTips.map((tip, index) => {
              const colors = getColorClasses(tip.color);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-700/70 transition-all duration-200 group"
                >
                  <div
                    className={`w-2 h-2 ${colors.dot} rounded-full group-hover:scale-110 transition-transform duration-200`}
                  ></div>
                  <div className="flex items-center gap-2 flex-1">
                    <div className="text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200">
                      {tip.icon}
                    </div>
                    <div className="flex-1">
                      <span className={`font-mono text-sm font-medium ${colors.text}`}>
                        {tip.syntax}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                        {tip.description}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {tip.example}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-blue-50/80 dark:bg-blue-900/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-sm">
              <FiSearch className="w-4 h-4" />
              <span className="font-medium">Pro tip:</span>
              <span>Combine multiple search terms for better results</span>
            </div>
          </div>
        </div>
      ) : isLoading ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <FiSearch className="w-5 h-5 text-blue-500 dark:text-blue-400 animate-pulse" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Searching...</h4>
          </div>
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex gap-3 items-center p-3 rounded-lg bg-gray-50/80 dark:bg-gray-700/50 animate-pulse"
            >
              <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-1 max-h-80 overflow-y-auto custom-scrollbar-thin">
          <div className="flex items-center gap-2 mb-3 sticky top-0 bg-white dark:bg-gray-800 py-1 z-10">
            <FiSearch className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Search Results ({searchResults.length})
            </h4>
          </div>

          {searchResults.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex gap-3 items-center text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 p-3 rounded-lg transition-all duration-200 cursor-pointer group"
              onClick={() => navigate(`/questions/${question.id}`)}
            >
              <FiSearch className="text-blue-600 dark:text-blue-400 text-sm group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 text-sm truncate block">
                  {question.title}
                </span>
                {question.tags.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {question.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {question.tags.length > 2 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{question.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <span>{question.upvotes.length}</span>
                <span>↑</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPopoverContent;
