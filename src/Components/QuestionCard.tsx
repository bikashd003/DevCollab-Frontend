import { useMutation } from '@apollo/client';
import { Skeleton } from '@nextui-org/react';
import { Avatar, message } from 'antd';
import moment from 'moment';
import { FaChevronDown, FaChevronUp, FaShareAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { DISLIKE_QUESTION, LIKE_QUESTION } from '../GraphQL/Mutations/Questions/Question';
import { GET_ALL_QUESTIONS, SEARCH_QUESTIONS } from '../GraphQL/Queries/Questions/Questions';
import { useAuth } from '../Secure/AuthContext';
import { useState, useEffect } from 'react';

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

interface QuestionCardProps {
  question: Question;
  loading: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, loading }) => {
  const navigate = useNavigate();
  const { isAuthenticated, currentUserId } = useAuth();
  const [optimisticVotes, setOptimisticVotes] = useState({
    upvotes: question.upvotes || [],
    downvotes: question.downvotes || [],
  });

  // Sync optimistic votes with actual question data when it changes
  useEffect(() => {
    setOptimisticVotes({
      upvotes: question.upvotes || [],
      downvotes: question.downvotes || [],
    });
  }, [question.upvotes, question.downvotes]);

  const [upVotes] = useMutation(LIKE_QUESTION, {
    onCompleted: () => {
      message.success('Question upvoted successfully');
    },
    onError: err => {
      message.error(err.message);
      // Revert optimistic update on error
      setOptimisticVotes({
        upvotes: question.upvotes || [],
        downvotes: question.downvotes || [],
      });
    },
    update: (cache, { data }) => {
      if (data?.upvoteQuestion) {
        // Update GET_ALL_QUESTIONS cache
        try {
          const existingQuestions = cache.readQuery<{
            getQuestions: {
              questions: Question[];
              totalQuestions: number;
              totalPages: number;
            };
          }>({
            query: GET_ALL_QUESTIONS,
            variables: { limit: 10, offset: 0 },
          });

          if (existingQuestions?.getQuestions?.questions) {
            const updatedQuestions = existingQuestions.getQuestions.questions.map((q: Question) =>
              q.id === question.id ? data.upvoteQuestion : q
            );

            cache.writeQuery({
              query: GET_ALL_QUESTIONS,
              variables: { limit: 10, offset: 0 },
              data: {
                getQuestions: {
                  ...existingQuestions.getQuestions,
                  questions: updatedQuestions,
                },
              },
            });
          }
        } catch (error) {
          message.error('Failed to update cache for GET_ALL_QUESTIONS');
        }

        // Update SEARCH_QUESTIONS cache if it exists
        try {
          const searchCache = cache.readQuery<{
            searchQuestions: {
              questions: Question[];
              totalPages: number;
            };
          }>({
            query: SEARCH_QUESTIONS,
            variables: { searchTerm: '', limit: 10, offset: 0 },
          });

          if (searchCache?.searchQuestions?.questions) {
            const updatedSearchQuestions = searchCache.searchQuestions.questions.map(
              (q: Question) => (q.id === question.id ? data.upvoteQuestion : q)
            );

            cache.writeQuery({
              query: SEARCH_QUESTIONS,
              variables: { searchTerm: '', limit: 10, offset: 0 },
              data: {
                searchQuestions: {
                  ...searchCache.searchQuestions,
                  questions: updatedSearchQuestions,
                },
              },
            });
          }
        } catch (error) {
          message.error('Failed to update cache for SEARCH_QUESTIONS');
        }
      }
    },
  });

  const [downVotes] = useMutation(DISLIKE_QUESTION, {
    onCompleted: () => {
      message.success('Question downvoted successfully');
    },
    onError: err => {
      message.error(err.message);
      // Revert optimistic update on error
      setOptimisticVotes({
        upvotes: question.upvotes || [],
        downvotes: question.downvotes || [],
      });
    },
    update: (cache, { data }) => {
      if (data?.downvoteQuestion) {
        // Update GET_ALL_QUESTIONS cache
        try {
          const existingQuestions = cache.readQuery<{
            getQuestions: {
              questions: Question[];
              totalQuestions: number;
              totalPages: number;
            };
          }>({
            query: GET_ALL_QUESTIONS,
            variables: { limit: 10, offset: 0 },
          });

          if (existingQuestions?.getQuestions?.questions) {
            const updatedQuestions = existingQuestions.getQuestions.questions.map((q: Question) =>
              q.id === question.id ? data.downvoteQuestion : q
            );

            cache.writeQuery({
              query: GET_ALL_QUESTIONS,
              variables: { limit: 10, offset: 0 },
              data: {
                getQuestions: {
                  ...existingQuestions.getQuestions,
                  questions: updatedQuestions,
                },
              },
            });
          }
        } catch (error) {
          message.error('Failed to update cache for GET_ALL_QUESTIONS');
        }

        // Update SEARCH_QUESTIONS cache if it exists
        try {
          const searchCache = cache.readQuery<{
            searchQuestions: {
              questions: Question[];
              totalPages: number;
            };
          }>({
            query: SEARCH_QUESTIONS,
            variables: { searchTerm: '', limit: 10, offset: 0 },
          });

          if (searchCache?.searchQuestions?.questions) {
            const updatedSearchQuestions = searchCache.searchQuestions.questions.map(
              (q: Question) => (q.id === question.id ? data.downvoteQuestion : q)
            );

            cache.writeQuery({
              query: SEARCH_QUESTIONS,
              variables: { searchTerm: '', limit: 10, offset: 0 },
              data: {
                searchQuestions: {
                  ...searchCache.searchQuestions,
                  questions: updatedSearchQuestions,
                },
              },
            });
          }
        } catch (error) {
          message.error('Failed to update cache for SEARCH_QUESTIONS');
        }
      }
    },
  });

  const handleVote = (_direction: 'up' | 'down') => {
    if (!isAuthenticated) {
      message.warning('Please login to vote on questions');
      return;
    }

    if (!currentUserId) {
      message.error('User authentication error');
      return;
    }

    // Optimistic update
    if (_direction === 'up') {
      const userHasUpvoted = optimisticVotes.upvotes.some(vote => vote.id === currentUserId);

      if (userHasUpvoted) {
        // Remove upvote
        setOptimisticVotes(prev => ({
          ...prev,
          upvotes: prev.upvotes.filter(vote => vote.id !== currentUserId),
        }));
      } else {
        // Add upvote and remove downvote if exists
        setOptimisticVotes(prev => ({
          upvotes: [
            ...prev.upvotes.filter(vote => vote.id !== currentUserId),
            { id: currentUserId },
          ],
          downvotes: prev.downvotes.filter(vote => vote.id !== currentUserId),
        }));
      }

      upVotes({ variables: { id: question.id } });
    } else {
      const userHasDownvoted = optimisticVotes.downvotes.some(vote => vote.id === currentUserId);

      if (userHasDownvoted) {
        // Remove downvote
        setOptimisticVotes(prev => ({
          ...prev,
          downvotes: prev.downvotes.filter(vote => vote.id !== currentUserId),
        }));
      } else {
        // Add downvote and remove upvote if exists
        setOptimisticVotes(prev => ({
          downvotes: [
            ...prev.downvotes.filter(vote => vote.id !== currentUserId),
            { id: currentUserId },
          ],
          upvotes: prev.upvotes.filter(vote => vote.id !== currentUserId),
        }));
      }

      downVotes({ variables: { id: question.id } });
    }
  };
  const handleShare = () => {
    navigator.clipboard
      .writeText(window.location.origin + `/questions/${question.id}`)
      .then(() => message.success('Link copied to clipboard!'))
      .catch(() => message.error('Failed to copy link'));
  };
  const totalVotes =
    (optimisticVotes.upvotes?.length || 0) - (optimisticVotes.downvotes?.length || 0);

  // Check if current user has voted
  const hasUpvoted =
    currentUserId && optimisticVotes.upvotes.some(vote => vote.id === currentUserId);
  const hasDownvoted =
    currentUserId && optimisticVotes.downvotes.some(vote => vote.id === currentUserId);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 group overflow-hidden">
      {/* Question Details */}
      <div className="p-6">
        {/* Author Info */}
        <div className="flex items-center gap-3 mb-4">
          <Skeleton isLoaded={!loading} className="rounded-full w-10 h-10">
            {question.author.profilePicture ? (
              <Avatar
                size={40}
                src={question.author.profilePicture}
                alt={question.author.username}
                className="ring-2 ring-blue-500/20"
              />
            ) : (
              <Avatar size={40} className="bg-blue-600 text-white font-semibold">
                {question.author.username.charAt(0).toUpperCase()}
              </Avatar>
            )}
          </Skeleton>
          <div className="flex-1">
            <Skeleton isLoaded={!loading} className="h-4 w-24 mb-1 rounded-md">
              <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                {question.author.username}
              </div>
            </Skeleton>
            <Skeleton isLoaded={!loading} className="h-3 w-20 rounded-md">
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {moment(parseInt(question.createdAt)).fromNow()}
              </div>
            </Skeleton>
          </div>
        </div>

        {/* Question Title */}
        <Skeleton isLoaded={!loading} className="h-fit w-full mb-4 rounded-md">
          <h3
            className="text-lg font-bold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 leading-snug line-clamp-2"
            onClick={() => navigate(`/questions/${question.id}`)}
          >
            {question.title}
          </h3>
        </Skeleton>

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          {loading ? (
            <>
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </>
          ) : (
            question.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="bg-gray-100/80 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full px-3 py-1.5 text-xs font-semibold border border-gray-200/50 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-200 cursor-pointer"
              >
                {tag}
              </span>
            ))
          )}
          {question.tags.length > 3 && (
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium ml-1">
              +{question.tags.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Footer with Vote and Share Buttons */}
      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/50">
        {/* Voting Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleVote('up')}
            className={`transition-all duration-200 p-2 rounded-lg active:scale-95 ${
              hasUpvoted
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                : 'text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20'
            }`}
            aria-label="Upvote"
            disabled={loading}
          >
            <FaChevronUp size={16} />
          </button>
          <Skeleton isLoaded={!loading} className="h-6 w-8 rounded-md">
            <div
              className={`text-sm font-bold min-w-[2rem] text-center ${
                totalVotes > 0
                  ? 'text-green-600 dark:text-green-400'
                  : totalVotes < 0
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {totalVotes}
            </div>
          </Skeleton>
          <button
            onClick={() => handleVote('down')}
            className={`transition-all duration-200 p-2 rounded-lg active:scale-95 ${
              hasDownvoted
                ? 'text-red-500 dark:text-red-400 bg-red-50/50 dark:bg-red-900/20'
                : 'text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20'
            }`}
            aria-label="Downvote"
            disabled={loading}
          >
            <FaChevronDown size={16} />
          </button>
        </div>

        {/* Share Button */}
        <Skeleton isLoaded={!loading} className="h-8 w-20 rounded-lg">
          <button
            onClick={handleShare}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 h-8 rounded-lg px-3 flex items-center gap-2 font-semibold transition-all duration-200 text-xs active:scale-95"
            aria-label="Share question"
          >
            <FaShareAlt size={12} />
            <span>Share</span>
          </button>
        </Skeleton>
      </div>
    </div>
  );
};

export default QuestionCard;
