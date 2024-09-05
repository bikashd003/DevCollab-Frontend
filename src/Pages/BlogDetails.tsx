import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useState } from 'react';
import moment from 'moment';
import { GET_BLOG_DETAILS } from '../GraphQL/Mutations/Blogs/Blogs';
import { Skeleton, Button } from '@nextui-org/react';
import { Avatar, Tag } from 'antd';
import { LikeOutlined, CommentOutlined } from '@ant-design/icons';

const BlogDetails = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_BLOG_DETAILS, {
    variables: { id },
  });

  const [likes, setLikes] = useState(0);
  const [comment, setComment] = useState('');
  const blog = data?.getBlogById;
  if (loading) return <Skeleton />;
  if (error) return <p>Error loading blog details</p>;

  return (
    <div className="min-h-screen p-8 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-green-600 dark:text-green-400">
            {blog?.title}
          </h1>
          <div className="flex items-center space-x-2">
            <Avatar src={blog?.author?.profilePicture} />
            <span className="text-gray-600 dark:text-gray-300">{blog?.author?.username}</span>
            <p className="text-sm text-zinc-400">
              posted on {blog?.author?.username} • {moment(parseInt(blog?.createdAt)).fromNow()}
            </p>
          </div>
        </header>

        <main>
          <div className="mb-8 p-6 rounded-lg bg-white dark:bg-gray-800">
            <p className="mb-4">{blog?.content}</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Button
                startContent={<LikeOutlined />}
                onClick={() => setLikes(likes + 1)}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                {likes} Likes
              </Button>
              <Button
                startContent={<CommentOutlined />}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                10 Comments
              </Button>
            </div>
            <div className="space-x-2">
              {blog?.tags?.map((tag: string) => (
                <Tag
                  key={tag}
                  className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                >
                  {tag}
                </Tag>
              ))}
            </div>
          </div>

          <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">Comments</h2>
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="p-4 rounded bg-gray-100 dark:bg-gray-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <Avatar src={`https://joeschmoe.io/api/v1/random${i}`} />
                    <span className="font-semibold text-gray-700 dark:text-gray-300">User {i}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    This is a great article! Thanks for sharing.
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">
              Leave a Comment
            </h2>
            <textarea
              rows={4}
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="mb-4 bg-white text-gray-900 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
            />
            <Button
              variant="solid"
              className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
            >
              Submit Comment
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BlogDetails;
