import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { motion } from 'framer-motion';
import { Bookmark, Eye, ArrowLeft, Clock, Trash2 } from 'lucide-react';
import { Avatar, Skeleton, message } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { GET_USER_BOOKMARKS } from '../GraphQL/Queries/Questions/Questions';
import { REMOVE_BOOKMARK } from '../GraphQL/Mutations/Questions/Question';
import { useAuth } from '../Secure/AuthContext';

interface BookmarkItem {
  id: string;
  createdAt: string;
  question: {
    id: string;
    title: string;
    content: string;
    tags: string[];
    views: number;
    author: {
      id: string;
      username: string;
      profilePicture: string;
    };
    createdAt: string;
  };
}

const Bookmarks: React.FC = () => {
  const navigate = useNavigate();
  const { currentUserId } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const { loading, error, data, refetch } = useQuery(GET_USER_BOOKMARKS, {
    variables: { limit, offset },
    skip: !currentUserId,
  });

  const [removeBookmark] = useMutation(REMOVE_BOOKMARK, {
    onCompleted: () => {
      message.success('Bookmark removed successfully');
      refetch();
    },
    onError: err => {
      message.error(err.message);
    },
  });

  const handleRemoveBookmark = async (questionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await removeBookmark({ variables: { questionId } });
    } catch (error) {
      // Error handling is done in mutation onError callback
    }
  };

  if (!currentUserId) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="h-20"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center">
            <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Login Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Please login to view your bookmarks.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="h-20"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center">
            <Bookmark className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Error Loading Bookmarks
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              We couldn't load your bookmarks. Please try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const bookmarks = data?.getUserBookmarks?.bookmarks || [];
  const totalPages = data?.getUserBookmarks?.totalPages || 1;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="h-20"></div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Bookmarked Questions
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Questions you've saved for later
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className="w-full h-32 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              />
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Bookmarks Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start bookmarking questions to save them for later.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/questions')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
            >
              Browse Questions
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {bookmarks.map((item: BookmarkItem, index: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer relative group"
                onClick={() => navigate(`/questions/${item.question.id}`)}
              >
                {/* Remove bookmark button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={e => handleRemoveBookmark(item.question.id, e)}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900/30"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>

                <div className="flex flex-col lg:flex-row gap-4 pr-12">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {item.question.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Bookmark className="w-4 h-4" />
                        <span>Bookmarked {moment(parseInt(item.createdAt)).fromNow()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Asked {moment(parseInt(item.question.createdAt)).fromNow()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{item.question.views} views</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {item.question.tags && item.question.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.question.tags.slice(0, 3).map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.question.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                            +{item.question.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-3">
                    {item.question.author.profilePicture ? (
                      <Avatar
                        size="large"
                        src={item.question.author.profilePicture}
                        alt={item.question.author.username}
                        className="border-2 border-blue-500"
                      />
                    ) : (
                      <Avatar
                        size="large"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 border-2 border-blue-500 text-white font-bold"
                      >
                        {item.question.author.username?.charAt(0)?.toUpperCase()}
                      </Avatar>
                    )}
                    <div>
                      <p className="font-medium text-blue-600 dark:text-blue-400">
                        {item.question.author.username}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Author</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <motion.button
                      key={page}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        currentPage === page
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Bookmarks;
