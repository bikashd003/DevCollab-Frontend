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
    <div className="bg-theme-secondary border-theme-primary border rounded-xl shadow-theme-md hover:shadow-theme-lg transition-all duration-300 glass-theme hover-theme-bg group">
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
                className="border-2 border-theme-accent"
              />
            ) : (
              <Avatar size="large" className="bg-theme-accent text-white">
                {question.author.username.charAt(0)}
              </Avatar>
            )}
          </Skeleton>
          <div>
            <Skeleton isLoaded={!loading} className="h-5 w-24 mb-1">
              <div className="font-semibold text-theme-primary">{question.author.username}</div>
            </Skeleton>
            <Skeleton isLoaded={!loading} className="h-4 w-32">
              <div className="text-sm text-theme-muted">
                {moment(parseInt(question.createdAt)).fromNow()}
              </div>
            </Skeleton>
          </div>
        </div>
        {/* Question Title */}
        <Skeleton isLoaded={!loading} className="h-fit w-full mb-4">
          <h3
            className="text-lg font-semibold text-theme-accent cursor-pointer hover:text-theme-primary transition-colors duration-200 group-hover:translate-x-1 transform"
            onClick={() => navigate(`/questions/${question.id}`)}
          >
            {question.title}
          </h3>
        </Skeleton>
        {/* Tags */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {loading ? (
            <>
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </>
          ) : (
            question.tags.map(tag => (
              <div
                key={tag}
                className="bg-theme-muted text-theme-primary rounded-full px-3 py-1 text-xs font-medium border border-theme-primary hover:bg-theme-accent hover:text-white transition-all duration-200 cursor-pointer"
              >
                {tag}
              </div>
            ))
          )}
        </div>
      </div>
      {/* Footer with Vote and Share Buttons */}
      <div className="px-6 py-4 flex items-center justify-between border-t border-theme-primary bg-theme-muted rounded-b-xl">
        {/* Voting Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleVote('up')}
            className="text-theme-muted hover:text-theme-accent transition-all duration-200 p-2 rounded-lg hover:bg-theme-secondary transform hover:scale-110"
          >
            <FaChevronUp size={16} />
          </button>
          <Skeleton isLoaded={!loading} className="h-6 w-8 rounded">
            <div className="text-lg font-medium text-theme-primary">{question.votes || 0}</div>
          </Skeleton>
          <button
            onClick={() => handleVote('down')}
            className="text-theme-muted hover:text-red-500 transition-all duration-200 p-2 rounded-lg hover:bg-theme-secondary transform hover:scale-110"
          >
            <FaChevronDown size={16} />
          </button>
        </div>
        {/* Share Button */}
        <Skeleton isLoaded={!loading} className="h-9 w-24 rounded-lg">
          <button
            onClick={handleShare}
            className="bg-theme-primary border border-theme-primary text-theme-primary hover:bg-theme-accent hover:text-white h-9 rounded-lg px-4 flex items-center gap-2 font-medium transition-all duration-300 shadow-theme-sm hover:shadow-theme-md transform hover:-translate-y-0.5"
          >
            <FaShareAlt size={14} /> Share
          </button>
        </Skeleton>
      </div>
    </div>
  );
};
export default QuestionCard;
