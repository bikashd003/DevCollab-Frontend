import type { FormikHelpers } from 'formik';
import React, { useState } from 'react';
import { BsShare } from 'react-icons/bs';
import { FaThumbsUp } from 'react-icons/fa';
import { FiMessageSquare, FiEdit3, FiUsers, FiEdit } from 'react-icons/fi';
import { useQuery, useMutation } from '@apollo/client';
import { CREATE_BLOG_MUTATION, UPDATE_BLOG } from '../GraphQL/Mutations/Blogs/Blogs';
import { Avatar, message } from 'antd';
import { LIKE_BLOG } from '../GraphQL/Mutations/Blogs/Blogs';
import { GET_BLOGS, GET_POPULAR_TAGS } from '../GraphQL/Queries/Blogs/Blog';
import moment from 'moment';
import { motion } from 'framer-motion';
import { Skeleton, Button } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { GET_TOP_CONTRIBUTORS } from '../GraphQL/Queries/Blogs/Blog';
import { GET_USER_DATA } from '../GraphQL/Queries/Profile/Users';
import BlogModal from '../Components/Blog/BlogModal';

// Type definitions
interface BlogFormValues {
  title: string;
  tags: string[];
  tagInput: string;
}

interface Blog {
  id: number;
  title: string;
  content: string;
  tags: string[];
  comments: {
    content: string;
    author: {
      id: string;
      username: string;
      profilePicture: string;
    };
  }[];
  likes: {
    username: string;
  }[];
  author: {
    id: string;
    username: string;
    profilePicture: string;
  };
  createdAt: string;
}
interface TopContributor {
  username: string;
  profilePicture: string;
}
interface PopularTag {
  tag: string;
  count: number;
}

// Empty State Component for Blogs
const BlogEmptyState: React.FC<{ onCreateBlog: () => void }> = ({ onCreateBlog }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <div className="w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center mb-2">
          <FiEdit3 className="w-8 h-8 text-white" />
        </div>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-gray-900 dark:text-white text-2xl font-bold mb-3"
      >
        No Blog Posts Yet
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-gray-600 dark:text-gray-300 max-w-md mb-8 leading-relaxed"
      >
        Be the first to share your knowledge and insights with the community. Start writing your
        first blog post and inspire others!
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Button
          onClick={onCreateBlog}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          startContent={<FiEdit3 className="w-4 h-4" />}
        >
          Write First Blog
        </Button>
        <Button
          onClick={() => navigate('/community')}
          variant="bordered"
          className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          startContent={<FiUsers className="w-4 h-4" />}
        >
          Explore Community
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default function BlogPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const navigate = useNavigate();
  const [likeBlog] = useMutation(LIKE_BLOG);
  const { loading, data, refetch, error } = useQuery(GET_BLOGS);
  const { data: userData } = useQuery(GET_USER_DATA);
  const { data: topContributors, loading: contributorsLoading } = useQuery(GET_TOP_CONTRIBUTORS);
  const { data: popularTags, loading: tagsLoading } = useQuery(GET_POPULAR_TAGS);

  const [createBlog] = useMutation(CREATE_BLOG_MUTATION, {
    onCompleted: () => {
      message.success('Blog created successfully');
      setIsModalOpen(false);
      setTags([]);
      setContent('');
      refetch();
    },
    onError: err => {
      message.error(err.message);
    },
  });

  const [updateBlog] = useMutation(UPDATE_BLOG, {
    onCompleted: () => {
      message.success('Blog updated successfully');
      setIsModalOpen(false);
      setEditingBlog(null);
      setTags([]);
      setContent('');
      refetch();
    },
    onError: err => {
      message.error(err.message);
    },
  });
  // Unified submit handler for both create and edit
  const handleSubmit = async (
    values: BlogFormValues,
    { setSubmitting, resetForm }: FormikHelpers<BlogFormValues>
  ) => {
    if (content === '') {
      message.error('Content is required');
      setSubmitting(false);
      return;
    }

    try {
      if (modalMode === 'edit' && editingBlog) {
        await updateBlog({
          variables: {
            id: editingBlog.id,
            title: values.title,
            content: content,
            tags: values.tags,
          },
        });
      } else {
        await createBlog({
          variables: {
            title: values.title,
            content: content,
            tags: values.tags,
          },
        });
      }
      resetForm();
    } catch (err) {
      message.error('Failed to submit blog');
    }
    setSubmitting(false);
    setIsModalOpen(false);
  };
  const handleLikeBlog = async (id: number) => {
    await likeBlog({ variables: { id: id } });
    refetch();
  };

  // Tag handling functions
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>, setFieldValue: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      const newTag = target.value.trim();

      if (newTag && !tags.includes(newTag)) {
        const updatedTags = [...tags, newTag];
        setTags(updatedTags);
        setFieldValue('tags', updatedTags);
        setFieldValue('tagInput', '');
      }
    }
  };

  const removeTag = (index: number, setFieldValue: any) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
    setFieldValue('tags', updatedTags);
  };

  // Create blog handler
  const handleCreateBlog = () => {
    setModalMode('create');
    setEditingBlog(null);
    setContent('');
    setTags([]);
    setIsModalOpen(true);
  };

  // Edit functionality handlers
  const handleEditBlog = (blog: Blog) => {
    setEditingBlog(blog);
    setContent(blog.content);
    setTags(blog.tags || []);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  // Only the JSX className and styles are modified for modern and dark styling enhancements

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="h-20"></div>
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-center py-20 max-w-xl mx-auto"
          >
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              We encountered an error while loading blogs. Please try again or contact support if
              the problem persists.
            </p>
            <Button
              onClick={() => refetch()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Try Again
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="h-20"></div>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4 space-y-6">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div>
                <h1 className="text-gray-900 dark:text-white text-3xl lg:text-4xl font-bold tracking-tight">
                  Community Blog
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Share your knowledge and learn from the community
                </p>
              </div>
              <Button
                onClick={handleCreateBlog}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap"
                startContent={<FiEdit3 className="w-4 h-4" />}
              >
                Write New Post
              </Button>
            </motion.div>

            {/* Blog Posts Section */}
            {loading ? (
              // Loading Skeletons
              <div className="space-y-6">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="w-full h-48 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  />
                ))}
              </div>
            ) : data?.getBlogs?.length === 0 ? (
              // Empty State
              <BlogEmptyState onCreateBlog={handleCreateBlog} />
            ) : (
              // Blog Posts
              <div className="space-y-6">
                {data?.getBlogs?.map((blog: Blog, index: number) => (
                  <motion.div
                    key={blog?.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4 mb-5">
                      <Avatar
                        size="large"
                        src={blog?.author?.profilePicture || undefined}
                        alt={blog?.author?.username}
                        className="border-2 border-blue-500"
                      >
                        {!blog?.author?.profilePicture &&
                          blog?.author?.username?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h2
                          className="text-gray-900 dark:text-white text-xl font-semibold tracking-tight hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors duration-200"
                          onClick={() => navigate(`/blog/${blog?.id}`)}
                        >
                          {blog?.title}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                          by <span className="font-medium">{blog?.author?.username}</span> •{' '}
                          {moment(parseInt(blog?.createdAt)).fromNow()}
                        </p>
                      </div>
                    </div>

                    <div className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      {blog?.content?.replace(/[#*`_~[\]()]/g, '').slice(0, 150)}...
                    </div>

                    <div className="flex justify-between items-center text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex space-x-6">
                        <button
                          className={`flex items-center space-x-2 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg px-2 py-1 transition-colors duration-200 ${
                            blog?.likes?.some(like => like.username === userData?.user?.username)
                              ? 'text-blue-600 dark:text-blue-400'
                              : ''
                          }`}
                          onClick={() => handleLikeBlog(blog?.id)}
                          aria-label="Like blog"
                        >
                          <FaThumbsUp size={16} />
                          <span>{blog?.likes?.length}</span>
                        </button>
                        <div className="flex items-center space-x-2">
                          <FiMessageSquare size={16} />
                          <span>{blog?.comments?.length || 0}</span>
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        {/* Edit button - only show for blog author */}
                        {blog?.author?.id === userData?.user?.id && (
                          <button
                            className="flex items-center space-x-1 hover:text-green-600 dark:hover:text-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 rounded-lg px-2 py-1 transition-colors duration-200"
                            onClick={() => handleEditBlog(blog)}
                            aria-label="Edit blog"
                          >
                            <FiEdit size={16} />
                            <span>Edit</span>
                          </button>
                        )}
                        <button
                          className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg px-2 py-1 transition-colors duration-200"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${window.location.origin}/blog/${blog?.id}`
                            );
                            message.success('Link copied to clipboard');
                          }}
                          aria-label="Share blog link"
                        >
                          <BsShare size={16} />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/4 space-y-6">
            {/* Popular Tags Section */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6"
            >
              <h2 className="text-gray-900 dark:text-white text-xl font-semibold mb-5">
                Popular Tags
              </h2>
              {tagsLoading ? (
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <Skeleton
                      key={idx}
                      className="h-8 w-16 rounded-full bg-gray-200 dark:bg-gray-700"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {popularTags?.getPopularTags?.map((tag: PopularTag, idx: number) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 cursor-pointer px-3 py-1 rounded-full text-sm font-medium select-none transition-colors duration-200"
                      title={`#${tag.tag} (${tag.count} posts)`}
                    >
                      #{tag.tag}
                    </motion.span>
                  ))}
                </div>
              )}
            </motion.section>

            {/* Top Contributors Section */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6"
            >
              <h2 className="text-gray-900 dark:text-white text-xl font-semibold mb-5">
                Top Contributors
              </h2>
              {contributorsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <Skeleton className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                      <Skeleton className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-4">
                  {topContributors?.topContributors?.map(
                    (contributor: TopContributor, idx: number) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
                      >
                        <Avatar
                          size="default"
                          src={contributor.profilePicture || undefined}
                          alt={contributor.username}
                          className="border-2 border-blue-500"
                        >
                          {!contributor.profilePicture &&
                            contributor.username?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {contributor.username}
                        </span>
                      </motion.li>
                    )
                  )}
                </ul>
              )}
            </motion.section>
          </aside>
        </div>
      </main>

      {/* Blog Modal */}
      <BlogModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        content={content}
        setContent={setContent}
        tags={tags}
        setTags={setTags}
        handleTagInput={handleTagInput}
        removeTag={removeTag}
        mode={modalMode}
        editingBlog={editingBlog}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
