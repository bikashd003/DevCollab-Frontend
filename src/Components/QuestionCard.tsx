import { useMutation } from '@apollo/client';
import { Skeleton } from '@nextui-org/react';
import { Avatar, message } from 'antd';
import moment from 'moment';
import { FaChevronDown, FaChevronUp, FaShareAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { DISLIKE_QUESTION, LIKE_QUESTION } from '../GraphQL/Mutations/Questions/Question';

interface Question {
  id: string;
  title: string;
  votes: number;
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
  const [upVotes] = useMutation(LIKE_QUESTION, {
    onCompleted: () => {
      // TODO: Update the question with the new vote count
    },
    onError: err => {
      message.error(err.message);
    },
  });
  const [downVotes] = useMutation(DISLIKE_QUESTION, {
    onCompleted: () => {
      // TODO: Update the question with the new vote count
    },
    onError: err => {
      message.error(err.message);
    },
  });
  const handleVote = (_direction: 'up' | 'down') => {
    if (_direction === 'up') {
      upVotes({ variables: { id: question.id } });
    } else {
      downVotes({ variables: { id: question.id } });
    }
  };
  const handleShare = () => {
    navigator.clipboard
      .writeText(window.location.origin + `/questions/${question.id}`)
      .then(() => message.success('Link copied to clipboard!'))
      .catch(() => message.error('Failed to copy link'));
  };
  return (
    <div className="rounded-lg border bg-background text-foreground dark:bg-dark-background dark:text-dark-foreground shadow-sm">
      {/* Question Details */}
      <div className="p-6">
        {/* Author Info */}
        <div className="flex items-center gap-3 mb-4">
          <Skeleton isLoaded={!loading} className="rounded-full w-10 h-10">
            {question.author.profilePicture ? (
              <Avatar
                size="large"
                src={question.author.profilePicture}
                alt={question.author.username}
              />
            ) : (
              <Avatar size="large">{question.author.username.charAt(0)}</Avatar>
            )}
          </Skeleton>
          <div>
            <Skeleton isLoaded={!loading} className="h-5 w-24 mb-1">
              <div className="font-semibold">{question.author.username}</div>
            </Skeleton>
            <Skeleton isLoaded={!loading} className="h-4 w-32">
              <div className="text-sm text-muted-foreground">
                {moment(parseInt(question.createdAt)).fromNow()}
              </div>
            </Skeleton>
          </div>
        </div>
        {/* Question Title */}
        <Skeleton isLoaded={!loading} className="h-fit w-full mb-4">
          <h3
            className="text-lg font-semibold text-blue-500 cursor-pointer"
            onClick={() => navigate(`/questions/${question.id}`)}
          >
            {question.title}
          </h3>
        </Skeleton>
        {/* Tags */}
        <div className="flex items-center gap-2 mt-4">
          {loading ? (
            <>
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </>
          ) : (
            question.tags.map(tag => (
              <div
                key={tag}
                className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md px-2 py-1 text-xs font-mono"
              >
                {tag}
              </div>
            ))
          )}
        </div>
      </div>
      {/* Footer with Vote and Share Buttons */}
      <div className="p-6 flex items-center justify-between border-t border-gray-300 dark:border-gray-800">
        {/* Voting Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleVote('up')}
            className="text-gray-500 hover:text-blue-500 transition-colors"
          >
            <FaChevronUp />
          </button>
          <Skeleton isLoaded={!loading} className="h-6 w-8">
            {/* <div className="text-lg font-medium">{votes}</div> */}
          </Skeleton>
          <button
            onClick={() => handleVote('down')}
            className="text-gray-500 hover:text-red-500 transition-colors"
          >
            <FaChevronDown />
          </button>
        </div>
        {/* Share Button */}
        <Skeleton isLoaded={!loading} className="h-9 w-24">
          <button
            onClick={handleShare}
            className="border bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground hover:bg-muted hover:text-accent-foreground h-9 rounded-md px-3 flex items-center gap-2"
          >
            <FaShareAlt /> Share
          </button>
        </Skeleton>
      </div>
    </div>
  );
};
export default QuestionCard;
