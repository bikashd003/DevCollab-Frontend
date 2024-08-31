import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import moment from 'moment';
import { GET_BLOG_DETAILS } from '../GraphQL/Mutations/Blogs/Blogs';
import { Skeleton } from '@nextui-org/react';

const BlogDetails = () => {
  const { id } = useParams();
  const { loading, data } = useQuery(GET_BLOG_DETAILS, {
    variables: { id },
  });
  const blog = data?.getBlogById;
  return (
    <Skeleton
      isLoaded={!loading}
      className="p-6 dark:bg-dark-background border border-zinc-700 rounded-lg"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-10 h-10 bg-emerald-500 rounded-full">
          <img
            className="aspect-square h-full w-full"
            alt={blog?.author?.username}
            src={blog?.author?.profilePicture}
          />
        </div>
        <div>
          <h1 className="text-xl font-semibold">{blog?.title}</h1>
          <p className="text-sm text-zinc-400">
            by {blog?.author?.username} • {moment(parseInt(blog?.createdAt)).fromNow()}
          </p>
        </div>
      </div>
      <p className="text-zinc-300 mb-4">{blog?.content}</p>
      <div className="flex justify-between items-center text-zinc-400">
        <div className="flex space-x-4">
          {/* <p>Likes: {blog?.likes}</p> */}
          <p>Comments: {blog?.comments?.length}</p>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Comments</h2>
        {blog?.comments?.map(comment => (
          <div key={comment.id} className="border-t border-zinc-700 mt-2 pt-2">
            <p className="text-sm text-zinc-300">{comment.content}</p>
            <p className="text-xs text-zinc-400">- {comment.author.username}</p>
          </div>
        ))}
      </div>
    </Skeleton>
  );
};

export default BlogDetails;
