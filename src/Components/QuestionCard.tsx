/* eslint-disable react/prop-types */
import { Skeleton } from '@nextui-org/react';
import { Avatar } from 'antd';
import moment from 'moment';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface Question {
  id: number;
  title: string;
  content: string;
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

const QuestionCard: React.FC<QuestionCardProps> = ({ question, loading }) => (
  <Skeleton
    isLoaded={!loading}
    className="rounded-lg border bg-background text-foreground dark:bg-dark-background dark:text-dark-foreground shadow-sm"
  >
    {/* Question Details */}
    <div className="p-6">
      {/* Author Info */}
      <div className="flex items-center gap-3 mb-4">
        <span className="relative flex shrink-0 overflow-hidden rounded-full w-10 h-10">
          {question.author.profilePicture ? (
            <Avatar
              size="large"
              src={question.author.profilePicture}
              alt={question.author.username}
            />
          ) : (
            <Avatar size="large">{question.author.username.charAt(0)}</Avatar>
          )}
        </span>
        <div>
          <div className="font-semibold">{question.author.username}</div>
          <div className="text-sm text-muted-foreground">
            {moment(parseInt(question.createdAt)).fromNow()}
          </div>
        </div>
      </div>
      {/* Question Title */}
      <h3 className="text-lg font-semibold">{question.title}</h3>
      {/* Tags */}
      <div className="flex items-center gap-2 mt-4">
        {question.tags.map(tag => (
          <div
            key={tag}
            className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md px-2 py-1 text-xs font-mono"
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
    {/* Footer with Vote and Share Buttons */}
    <div className="p-6 flex items-center justify-between border-t border-gray-300 dark:border-gray-800">
      {/* Voting Buttons */}
      <div className="flex items-center gap-2">
        <FaChevronUp />
        <div className="text-lg font-medium">{question.votes}</div>
        <FaChevronDown />
      </div>
      {/* Share Button */}
      <div className="flex items-center gap-2">
        <button className="border bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground hover:bg-muted hover:text-accent-foreground h-9 rounded-md px-3">
          Share
        </button>
      </div>
    </div>
  </Skeleton>
);
export default QuestionCard;
