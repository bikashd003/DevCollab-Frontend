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
  Trash2,
  History,
} from 'lucide-react';
import { Avatar, message, Skeleton, Tooltip } from 'antd';
import moment from 'moment';
import { GET_QUESTION_BY_ID } from '../GraphQL/Queries/Questions/Questions';
import MarkdownPreviewComponent from '../Components/Global/MarkdownPreviewComponent';
import Editor from '../Components/Global/Editor';
import {
  CREATE_ANSWER,
  DISLIKE_QUESTION,
  LIKE_QUESTION,
  UPVOTE_ANSWER,
  DOWNVOTE_ANSWER,
  ACCEPT_ANSWER,
  DELETE_QUESTION,
  UPDATE_QUESTION,
  DELETE_ANSWER,
  UPDATE_ANSWER,
} from '../GraphQL/Mutations/Questions/Question';
import { useAuth } from '../Secure/AuthContext';
import ConfirmDialog from '../Components/Global/ConfirmDialog';
import EditQuestionModal from '../Components/Questions/EditQuestionModal';
import EditAnswerModal from '../Components/Questions/EditAnswerModal';
import { Button } from '@nextui-org/react';
interface Answer {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    profilePicture: string;
  };
  upvotes: { id: string }[];
  downvotes: { id: string }[];
  isAccepted: boolean;
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

  // Modal states
  const [deleteQuestionModal, setDeleteQuestionModal] = useState(false);
  const [editQuestionModal, setEditQuestionModal] = useState(false);
  const [editAnswerModal, setEditAnswerModal] = useState<{
    isOpen: boolean;
    answer: Answer | null;
  }>({
    isOpen: false,
    answer: null,
  });
  const [deleteAnswerModal, setDeleteAnswerModal] = useState<{
    isOpen: boolean;
    answerId: string | null;
  }>({
    isOpen: false,
    answerId: null,
  });

  // Edit form states
  const [editQuestionData, setEditQuestionData] = useState({
    title: '',
    content: '',
    tags: [] as string[],
  });
  const [editAnswerContent, setEditAnswerContent] = useState('');

  // Bookmark state
  const [isBookmarked, setIsBookmarked] = useState(false);
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

  // Answer voting mutations
  const [upvoteAnswer] = useMutation(UPVOTE_ANSWER, {
    onCompleted: () => {
      message.success('Answer upvoted successfully');
      refetch();
    },
    onError: err => {
      message.error(err.message);
    },
  });

  const [downvoteAnswer] = useMutation(DOWNVOTE_ANSWER, {
    onCompleted: () => {
      message.success('Answer downvoted successfully');
      refetch();
    },
    onError: err => {
      message.error(err.message);
    },
  });

  // Accept answer mutation
  const [acceptAnswer] = useMutation(ACCEPT_ANSWER, {
    onCompleted: () => {
      message.success('Answer accepted successfully');
      refetch();
    },
    onError: err => {
      message.error(err.message);
    },
  });

  // Delete mutations
  const [deleteQuestion] = useMutation(DELETE_QUESTION, {
    onCompleted: () => {
      message.success('Question deleted successfully');
      navigate('/questions');
    },
    onError: err => {
      message.error(err.message);
    },
  });

  const [deleteAnswerMutation] = useMutation(DELETE_ANSWER, {
    onCompleted: () => {
      message.success('Answer deleted successfully');
      refetch();
    },
    onError: err => {
      message.error(err.message);
    },
  });

  // Update mutations
  const [updateQuestion] = useMutation(UPDATE_QUESTION, {
    onCompleted: () => {
      message.success('Question updated successfully');
      setEditQuestionModal(false);
      refetch();
    },
    onError: err => {
      message.error(err.message);
    },
  });

  const [updateAnswer] = useMutation(UPDATE_ANSWER, {
    onCompleted: () => {
      message.success('Answer updated successfully');
      setEditAnswerModal({ isOpen: false, answer: null });
      refetch();
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

  // Answer voting handlers
  const handleUpvoteAnswer = async (answerId: string) => {
    await upvoteAnswer({ variables: { id: answerId } });
  };

  const handleDownvoteAnswer = async (answerId: string) => {
    await downvoteAnswer({ variables: { id: answerId } });
  };

  const handleAcceptAnswer = async (answerId: string) => {
    await acceptAnswer({ variables: { id: answerId } });
  };

  // Share functionality
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        message.success('Link copied to clipboard!');
      })
      .catch(() => {
        message.error('Failed to copy link');
      });
  };

  // Bookmark functionality
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    message.success(isBookmarked ? 'Bookmark removed' : 'Question bookmarked');
  };

  // History functionality
  const handleHistory = () => {
    // For now, just show a message. In a real app, this would show edit history
    message.info('Question history feature coming soon!');
  };

  // Edit question handlers
  const handleEditQuestion = () => {
    setEditQuestionData({
      title: question?.title || '',
      content: question?.content || '',
      tags: question?.tags || [],
    });
    setEditQuestionModal(true);
  };

  const handleUpdateQuestion = async () => {
    if (!editQuestionData.title.trim() || !editQuestionData.content.trim()) {
      message.error('Title and content are required');
      return;
    }

    await updateQuestion({
      variables: {
        id: question?.id,
        title: editQuestionData.title,
        content: editQuestionData.content,
        tags: editQuestionData.tags,
      },
    });
  };

  // Edit answer handlers
  const handleEditAnswer = (answer: Answer) => {
    setEditAnswerContent(answer.content);
    setEditAnswerModal({ isOpen: true, answer });
  };

  const handleUpdateAnswer = async () => {
    if (!editAnswerContent.trim()) {
      message.error('Answer content is required');
      return;
    }

    await updateAnswer({
      variables: {
        id: editAnswerModal.answer?.id,
        content: editAnswerContent,
      },
    });
  };

  // Delete handlers
  const handleDeleteQuestion = async () => {
    await deleteQuestion({ variables: { id: question?.id } });
  };

  const handleDeleteAnswer = async () => {
    if (deleteAnswerModal.answerId) {
      await deleteAnswerMutation({ variables: { id: deleteAnswerModal.answerId } });
      setDeleteAnswerModal({ isOpen: false, answerId: null });
    }
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
                    votes={(question?.upvotes?.length || 0) - (question?.downvotes?.length || 0)}
                    onUpvote={handleUpvoteQuestion}
                    onDownvote={handleDownvoteQuestion}
                    upvotes={question?.upvotes}
                    downvotes={question?.downvotes}
                    currentUserId={currentUserId || undefined}
                  />
                  <div className="flex lg:flex-col gap-2">
                    <BookmarkButton isBookmarked={isBookmarked} onClick={handleBookmark} />
                    <HistoryButton onClick={handleHistory} />
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
                      <ActionButton icon={<Share2 />} text="Share" onClick={handleShare} />
                      {question?.author?.id === currentUserId && (
                        <>
                          <ActionButton icon={<Edit3 />} text="Edit" onClick={handleEditQuestion} />
                          <ActionButton
                            icon={<Trash2 />}
                            text="Delete"
                            onClick={() => setDeleteQuestionModal(true)}
                            variant="danger"
                          />
                        </>
                      )}
                      <ActionButton
                        icon={<UserPlus />}
                        text="Follow"
                        onClick={() => message.info('Follow feature coming soon!')}
                      />
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
                      <AnswerSection
                        answer={answer}
                        currentUserId={currentUserId || ''}
                        questionAuthorId={question?.author?.id || ''}
                        onUpvote={handleUpvoteAnswer}
                        onDownvote={handleDownvoteAnswer}
                        onAccept={handleAcceptAnswer}
                        onEdit={handleEditAnswer}
                        onDelete={answerId => setDeleteAnswerModal({ isOpen: true, answerId })}
                        onShare={handleShare}
                      />
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
                <Editor
                  initialContent={content}
                  onChange={setContent}
                  minHeight="150px"
                  maxHeight="300px"
                />
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

      {/* Delete Question Modal */}
      <ConfirmDialog
        isOpen={deleteQuestionModal}
        onClose={() => setDeleteQuestionModal(false)}
        onConfirm={handleDeleteQuestion}
        title="Delete Question"
        message="Are you sure you want to delete this question? This action cannot be undone and will also delete all associated answers."
        type="danger"
        confirmText="Delete Question"
      />

      {/* Delete Answer Modal */}
      <ConfirmDialog
        isOpen={deleteAnswerModal.isOpen}
        onClose={() => setDeleteAnswerModal({ isOpen: false, answerId: null })}
        onConfirm={handleDeleteAnswer}
        title="Delete Answer"
        message="Are you sure you want to delete this answer? This action cannot be undone."
        type="danger"
        confirmText="Delete Answer"
      />

      {/* Edit Question Modal */}
      <EditQuestionModal
        editQuestionModal={editQuestionModal}
        setEditQuestionModal={setEditQuestionModal}
        editQuestionData={editQuestionData}
        setEditQuestionData={setEditQuestionData}
        handleUpdateQuestion={handleUpdateQuestion}
      />

      {/* Edit Answer Modal */}
      <EditAnswerModal
        isOpen={editAnswerModal.isOpen}
        onClose={() => setEditAnswerModal({ isOpen: false, answer: null })}
        editAnswerContent={editAnswerContent}
        setEditAnswerContent={setEditAnswerContent}
        handleUpdateAnswer={handleUpdateAnswer}
      />
    </div>
  );
};

const VoteButtons: React.FC<{
  votes: number;
  onUpvote: () => void;
  onDownvote: () => void;
  upvotes?: { id: string }[];
  downvotes?: { id: string }[];
  currentUserId?: string;
}> = ({ votes, onUpvote, onDownvote, upvotes = [], downvotes = [], currentUserId }) => {
  const hasUpvoted = currentUserId ? upvotes.some(vote => vote.id === currentUserId) : false;
  const hasDownvoted = currentUserId ? downvotes.some(vote => vote.id === currentUserId) : false;

  return (
    <div className="flex flex-row lg:flex-col items-center gap-2">
      <Tooltip title="Upvote" placement="top">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onUpvote}
          className={`p-2 rounded-lg transition-all duration-200 ${
            hasUpvoted
              ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
              : 'text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
          }`}
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
          className={`p-2 rounded-lg transition-all duration-200 ${
            hasDownvoted
              ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
              : 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
          }`}
        >
          <ArrowDown size={24} />
        </motion.button>
      </Tooltip>
    </div>
  );
};

const BookmarkButton: React.FC<{ isBookmarked: boolean; onClick: () => void }> = ({
  isBookmarked,
  onClick,
}) => (
  <Tooltip title={isBookmarked ? 'Remove Bookmark' : 'Bookmark'}>
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`p-2 rounded-lg transition-all duration-200 ${
        isBookmarked
          ? 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
          : 'text-gray-500 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
      }`}
    >
      <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
    </motion.button>
  </Tooltip>
);

const HistoryButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <Tooltip title="History">
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
    >
      <History size={18} />
    </motion.button>
  </Tooltip>
);

const ActionButton: React.FC<{
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
  variant?: 'default' | 'danger';
}> = ({ icon, text, onClick, variant = 'default' }) => {
  const baseClasses =
    'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium';
  const variantClasses =
    variant === 'danger'
      ? 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20'
      : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20';

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses}`}
    >
      {icon}
      {text}
    </motion.button>
  );
};

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

const AnswerSection: React.FC<{
  answer: Answer;
  currentUserId: string;
  questionAuthorId: string;
  onUpvote: (answerId: string) => void;
  onDownvote: (answerId: string) => void;
  onAccept: (answerId: string) => void;
  onEdit: (answer: Answer) => void;
  onDelete: (answerId: string) => void;
  onShare: () => void;
}> = ({
  answer,
  currentUserId,
  questionAuthorId,
  onUpvote,
  onDownvote,
  onAccept,
  onEdit,
  onDelete,
  onShare,
}) => {
  const votes = (answer.upvotes?.length || 0) - (answer.downvotes?.length || 0);
  const isQuestionAuthor = currentUserId === questionAuthorId;
  const isAnswerAuthor = currentUserId === answer.author.id;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Vote Section */}
        <div className="flex lg:flex-col items-center lg:items-start gap-2 lg:gap-4">
          <VoteButtons
            votes={votes}
            onUpvote={() => onUpvote(answer.id)}
            onDownvote={() => onDownvote(answer.id)}
            upvotes={answer.upvotes}
            downvotes={answer.downvotes}
            currentUserId={currentUserId}
          />
          {isQuestionAuthor && !answer.isAccepted && (
            <Tooltip title="Accept Answer">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onAccept(answer.id)}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
              >
                <CheckCircle size={18} />
              </motion.button>
            </Tooltip>
          )}
          {answer.isAccepted && (
            <Tooltip title="Accepted Answer">
              <div className="p-2 rounded-lg text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20">
                <CheckCircle size={18} fill="currentColor" />
              </div>
            </Tooltip>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 space-y-4">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <MarkdownPreviewComponent content={answer.content} />
          </div>

          {/* Actions and Author */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-3 mb-4 sm:mb-0">
              <ActionButton icon={<Share2 />} text="Share" onClick={onShare} />
              {isAnswerAuthor && (
                <>
                  <ActionButton icon={<Edit3 />} text="Edit" onClick={() => onEdit(answer)} />
                  <ActionButton
                    icon={<Trash2 />}
                    text="Delete"
                    onClick={() => onDelete(answer.id)}
                    variant="danger"
                  />
                </>
              )}
            </div>
            <AuthorInfo author={answer.author} createdAt={answer.createdAt} />
          </div>
        </div>
      </div>
    </div>
  );
};

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
