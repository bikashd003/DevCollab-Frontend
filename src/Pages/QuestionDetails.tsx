import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  FaCaretUp,
  FaCaretDown,
  FaCheck,
  FaBookmark,
  FaHistory,
  FaShare,
  FaEdit,
  FaUserPlus,
} from 'react-icons/fa';
import { Avatar, Button, Skeleton, Space, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { GET_QUESTION_BY_ID } from '../GraphQL/Queries/Questions/Questions';
import MarkdownPreviewComponent from '../Components/Global/MarkdownPreviewComponent';
import Editor from '../Components/Global/Editor';

const QuestionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState('');
  const { loading, error, data } = useQuery(GET_QUESTION_BY_ID, {
    variables: { id },
  });

  const question = data?.getQuestionById;

  if (error)
    return <div className="text-center text-2xl text-red-500">Error loading Question details</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <Skeleton loading={loading} active avatar paragraph={{ rows: 4 }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 sm:mb-0">
            {question?.title}
          </h1>
          <Button type="primary" size="large" className="bg-blue-500 hover:bg-blue-600">
            Ask Question
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex md:flex-col items-center md:items-start">
            <VoteButtons votes={42} />
            <BookmarkButton />
            <HistoryButton />
          </div>
          <div className="flex-grow">
            <MarkdownPreviewComponent content={question?.content} />
            <Space size={[0, 8]} wrap className="mb-4">
              {question?.tags?.map((tag: string) => (
                <Tag key={tag} color="blue">
                  {tag}
                </Tag>
              ))}
            </Space>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-500">
              <Space size="middle">
                <ActionButton icon={<FaShare />} text="Share" />
                <ActionButton icon={<FaEdit />} text="Edit" />
                <ActionButton icon={<FaUserPlus />} text="Follow" />
              </Space>
              <AuthorInfo author={question?.author} createdAt={question?.createdAt} />
            </div>
          </div>
        </div>
      </Skeleton>

      <Skeleton loading={loading} active avatar paragraph={{ rows: 4 }}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">2 Answers</h2>

        <AnswerSection />

        <div className="border-t pt-6 mt-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Your Answer</h3>
          <Editor initialContent={content} onChange={setContent} />
          <Button type="primary" size="large" className="mt-4 bg-blue-500 hover:bg-blue-600">
            Post Your Answer
          </Button>
        </div>
      </Skeleton>
    </div>
  );
};

const VoteButtons: React.FC<{ votes: number }> = ({ votes }) => (
  <div className="flex flex-row md:flex-col items-center">
    <Tooltip title="Upvote">
      <Button
        type="text"
        icon={<FaCaretUp size={36} />}
        className="text-gray-500 hover:text-orange-500"
      />
    </Tooltip>
    <span className="text-xl font-bold mx-2 md:my-2">{votes}</span>
    <Tooltip title="Downvote">
      <Button
        type="text"
        icon={<FaCaretDown size={36} />}
        className="text-gray-500 hover:text-orange-500"
      />
    </Tooltip>
  </div>
);

const BookmarkButton: React.FC = () => (
  <Tooltip title="Bookmark">
    <Button
      type="text"
      icon={<FaBookmark size={18} />}
      className="mt-4 text-gray-500 hover:text-yellow-500"
    />
  </Tooltip>
);

const HistoryButton: React.FC = () => (
  <Tooltip title="History">
    <Button
      type="text"
      icon={<FaHistory size={18} />}
      className="mt-4 text-gray-500 hover:text-blue-500"
    />
  </Tooltip>
);

const ActionButton: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <Button type="text" icon={icon} className="hover:text-blue-500">
    {text}
  </Button>
);

const AuthorInfo: React.FC<{
  author: { username: string; profilePicture: string };
  createdAt: string;
}> = ({ author, createdAt }) => (
  <Space align="center">
    {author?.profilePicture ? (
      <Avatar size="large" src={author.profilePicture} alt={author.username} />
    ) : (
      <Avatar size="large">{author?.username?.charAt(0)}</Avatar>
    )}
    <div>
      <p className="text-blue-500">{author?.username}</p>
      <p>{moment(parseInt(createdAt)).fromNow()}</p>
    </div>
  </Space>
);

const AnswerSection: React.FC = () => (
  <div className="border-t pt-6">
    <div className="flex flex-col md:flex-row gap-6 mb-8">
      <div className="flex md:flex-col items-center md:items-start">
        <VoteButtons votes={23} />
        <Tooltip title="Accept Answer">
          <Button type="text" icon={<FaCheck size={18} />} className="mt-4 text-green-500" />
        </Tooltip>
      </div>
      <div className="flex-grow">
        <p className="text-lg mb-4">
          To center a div within another div, you can use flexbox. Here's an updated CSS that will
          center your child div:
        </p>
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4 overflow-x-auto">
          {`.parent {
  width: 300px;
  height: 300px;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.child {
  width: 100px;
  height: 100px;
  background-color: #3498db;
}`}
        </pre>
        <p className="mb-4">
          This solution uses flexbox to center the child div both horizontally and vertically within
          the parent div.
        </p>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-500">
          <Space size="middle">
            <ActionButton icon={<FaShare />} text="Share" />
            <ActionButton icon={<FaEdit />} text="Edit" />
          </Space>
          <AuthorInfo
            author={{ username: 'Jane Smith', profilePicture: 'https://i.pravatar.cc/40?img=2' }}
            createdAt={(Date.now() - 3600000).toString()}
          />
        </div>
      </div>
    </div>
  </div>
);

export default QuestionDetails;
