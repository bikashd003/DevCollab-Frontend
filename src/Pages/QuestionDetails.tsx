import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Clock,
  Eye,
  ArrowUp,
  ArrowDown,
  Bookmark,
  Share2,
  Edit3,
  UserPlus,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Avatar, Button, message, Skeleton, Tooltip } from 'antd';
import moment from 'moment';
import { GET_QUESTION_BY_ID } from '../GraphQL/Queries/Questions/Questions';
import MarkdownPreviewComponent from '../Components/Global/MarkdownPreviewComponent';
import Editor from '../Components/Global/Editor';
import {
  CREATE_ANSWER,
  DISLIKE_QUESTION,
  LIKE_QUESTION,
} from '../GraphQL/Mutations/Questions/Question';
import { useAuth } from '../Secure/AuthContext';
interface Answer {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    profilePicture: string;
  };
  createdAt: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const QuestionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUserId } = useAuth();
  const [content, setContent] = useState('');
  const { loading, error, data, refetch } = useQuery(GET_QUESTION_BY_ID, {
    variables: { id },
  });
  const [postAnswer] = useMutation(CREATE_ANSWER, {
    onCompleted: () => {
      message.success('Answer posted successfully');
    },
    onError: err => {
      message.error(err.message);
    },
  });

  const [upvoteQuestion] = useMutation(LIKE_QUESTION, {
    onCompleted: () => {
      message.success('Question upvoted successfully');
    },
    onError: err => {
      message.error(err.message);
    },
  });
  const [downvoteQuestion] = useMutation(DISLIKE_QUESTION, {
    onCompleted: () => {
      message.success('Question downvoted successfully');
    },
    onError: err => {
      message.error(err.message);
    },
  });

  const question = data?.getQuestionById;
  // console.log(question);
  const handlePostAnswer = async () => {
    await postAnswer({ variables: { content, questionId: question?.id } });
    setContent('');
    refetch();
  };

  const handleUpvoteQuestion = async () => {
    await upvoteQuestion({ variables: { id: question?.id } });
    refetch();
  };
  const handleDownvoteQuestion = async () => {
    await downvoteQuestion({ variables: { id: question?.id } });
    refetch();
  };
  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="h-20"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Error Loading Question
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We couldn't load the question details. Please try again.
            </p>
            <Button
              onClick={() => navigate('/questions')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
            >
              Back to Questions
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Top spacing for floating nav */}
      <div className="h-20"></div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          // Modern Loading Skeletons
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                className="w-full h-48 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Header Section */}
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                    {question?.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Asked {moment(parseInt(question?.createdAt)).fromNow()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{question?.answers?.length || 0} answers</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>123 views</span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/questions/ask')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Ask Question
                </motion.button>
              </div>
            </motion.div>

            {/* Question Content */}
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row gap-6 p-6">
                {/* Vote Section */}
                <div className="flex lg:flex-col items-center lg:items-start gap-2 lg:gap-4">
                  <VoteButtons
                    votes={question?.upvotes?.length - question?.downvotes?.length || 0}
                    onUpvote={handleUpvoteQuestion}
                    onDownvote={handleDownvoteQuestion}
                  />
                  <div className="flex lg:flex-col gap-2">
                    <BookmarkButton />
                    <HistoryButton />
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 space-y-6">
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <MarkdownPreviewComponent content={question?.content} />
                  </div>

                  {/* Tags */}
                  {question?.tags && question.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {question.tags.map((tag: string) => (
                        <motion.span
                          key={tag}
                          whileHover={{ scale: 1.05 }}
                          className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200 cursor-pointer"
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  )}

                  {/* Actions and Author */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap gap-3 mb-4 sm:mb-0">
                      <ActionButton icon={<Share2 />} text="Share" />
                      {question?.author?.id === currentUserId && (
                        <ActionButton icon={<Edit3 />} text="Edit" />
                      )}
                      <ActionButton icon={<UserPlus />} text="Follow" />
                    </div>
                    <AuthorInfo author={question?.author} createdAt={question?.createdAt} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Answers Section */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {question?.answers?.length || 0}{' '}
                  {question?.answers?.length === 1 ? 'Answer' : 'Answers'}
                </h2>
              </div>

              {question?.answers && question.answers.length > 0 ? (
                <div className="space-y-6">
                  {question.answers.map((answer: Answer, index: number) => (
                    <motion.div
                      key={answer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <AnswerSection answer={answer} currentUserId={currentUserId || ''} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <AnswerEmptyState />
              )}
            </motion.div>

            {/* Your Answer Section */}
            <motion.div
              id="answer-editor"
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Your Answer</h3>
              <div className="space-y-4">
                <Editor initialContent={content} onChange={setContent} />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePostAnswer}
                  disabled={!content.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 disabled:transform-none disabled:shadow-none"
                >
                  <CheckCircle className="w-4 h-4" />
                  Post Your Answer
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

const VoteButtons: React.FC<{
  votes: number;
  onUpvote: () => void;
  onDownvote: () => void;
}> = ({ votes, onUpvote, onDownvote }) => (
  <div className="flex flex-row lg:flex-col items-center gap-2">
    <Tooltip title="Upvote" placement="top">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onUpvote}
        className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
      >
        <ArrowUp size={24} />
      </motion.button>
    </Tooltip>
    <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
      <span className="text-lg font-bold text-gray-900 dark:text-white">{votes}</span>
    </div>
    <Tooltip title="Downvote" placement="bottom">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onDownvote}
        className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
      >
        <ArrowDown size={24} />
      </motion.button>
    </Tooltip>
  </div>
);

const BookmarkButton: React.FC = () => (
  <Tooltip title="Bookmark">
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-200"
    >
      <Bookmark size={18} />
    </motion.button>
  </Tooltip>
);

const HistoryButton: React.FC = () => (
  <Tooltip title="History">
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
    >
      <Clock size={18} />
    </motion.button>
  </Tooltip>
);

const ActionButton: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 text-sm font-medium"
  >
    {icon}
    {text}
  </motion.button>
);

const AuthorInfo: React.FC<{
  author: { username: string; profilePicture: string };
  createdAt: string;
}> = ({ author, createdAt }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer"
  >
    {author?.profilePicture ? (
      <Avatar
        size="large"
        src={author.profilePicture}
        alt={author.username}
        className="border-2 border-blue-500 shadow-md"
      />
    ) : (
      <Avatar
        size="large"
        className="bg-gradient-to-r from-blue-500 to-purple-600 border-2 border-blue-500 shadow-md text-white font-bold"
      >
        {author?.username?.charAt(0)?.toUpperCase()}
      </Avatar>
    )}
    <div>
      <p className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
        {author?.username}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {moment(parseInt(createdAt)).fromNow()}
      </p>
    </div>
  </motion.div>
);

const AnswerSection: React.FC<{ answer: Answer; currentUserId: string }> = ({
  answer,
  currentUserId,
}) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Vote Section */}
      <div className="flex lg:flex-col items-center lg:items-start gap-2 lg:gap-4">
        <VoteButtons votes={23} onUpvote={() => {}} onDownvote={() => {}} />
        <Tooltip title="Accept Answer">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
          >
            <CheckCircle size={18} />
          </motion.button>
        </Tooltip>
      </div>

      {/* Content Section */}
      <div className="flex-1 space-y-4">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <MarkdownPreviewComponent content={answer.content} />
        </div>

        {/* Actions and Author */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-3 mb-4 sm:mb-0">
            <ActionButton icon={<Share2 />} text="Share" />
            {answer?.author?.id === currentUserId && <ActionButton icon={<Edit3 />} text="Edit" />}
          </div>
          <AuthorInfo author={answer.author} createdAt={answer.createdAt} />
        </div>
      </div>
    </div>
  </div>
);

// Empty state component for when there are no answers
const AnswerEmptyState: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center"
  >
    <MessageSquare className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No answers yet</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
      Be the first to help solve this question! Share your knowledge and contribute to the
      community.
    </p>
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() =>
        document.getElementById('answer-editor')?.scrollIntoView({ behavior: 'smooth' })
      }
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
    >
      Write the first answer
    </motion.button>
  </motion.div>
);

export default QuestionDetails;
