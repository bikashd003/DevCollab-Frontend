import React from 'react';
import type { FormikHelpers } from 'formik';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { useState, useEffect } from 'react';
import moment from 'moment';
import { motion } from 'framer-motion';
import { GET_BLOG_DETAILS } from '../GraphQL/Queries/Blogs/Blog';
import {
  CREATE_COMMENT,
  LIKE_BLOG,
  UPDATE_BLOG,
  DELETE_BLOG,
  LIKE_COMMENT,
  DELETE_COMMENT,
} from '../GraphQL/Mutations/Blogs/Blogs';
import { Skeleton, Button } from '@nextui-org/react';
import { Avatar, Tag, message } from 'antd';
import { Heart, MessageCircle, Calendar, User, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Secure/AuthContext';
import Editor from '../Components/Global/Editor';
import MarkdownPreviewComponent from '../Components/Global/MarkdownPreviewComponent';
import { useConfirm } from '../Components/Global/ConfirmProvider';
import BlogModal from '../Components/Blog/BlogModal';

// Type definitions
interface BlogFormValues {
  title: string;
  tags: string[];
  tagInput: string;
}

interface Author {
  id: string;
  username: string;
  profilePicture?: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: Author;
  likes: Array<{ id: string; username: string }>;
}

interface Blog {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  author: Author;
  likes: Array<{ id: string }>;
  comments: Comment[];
}

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUserId } = useAuth();
  const confirm = useConfirm();
  const { loading, error, data, refetch } = useQuery(GET_BLOG_DETAILS, {
    variables: { id },
  });
  const [createComment] = useMutation(CREATE_COMMENT);
  const [likeBlog] = useMutation(LIKE_BLOG);
  const [updateBlog] = useMutation(UPDATE_BLOG);
  const [deleteBlog] = useMutation(DELETE_BLOG);
  const [likeComment] = useMutation(LIKE_COMMENT);
  const [deleteComment] = useMutation(DELETE_COMMENT);
  const [comment, setComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentKey, setCommentKey] = useState(0);
  const [localLikes, setLocalLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [commentLikes, setCommentLikes] = useState<
    Record<string, { count: number; hasLiked: boolean }>
  >({});

  const blog: Blog | undefined = data?.getBlogById;

  // Update local likes when data loads
  useEffect(() => {
    if (blog?.likes) {
      setLocalLikes(blog.likes.length);
      // Check if the current user has liked the blog
      const userHasLiked = blog.likes.some(like => like.id === currentUserId);
      setHasLiked(userHasLiked);
    }
  }, [blog?.likes, currentUserId]);

  // Update comment likes when data loads
  useEffect(() => {
    if (blog?.comments) {
      const commentLikesMap: Record<string, { count: number; hasLiked: boolean }> = {};
      blog.comments.forEach(comment => {
        commentLikesMap[comment.id] = {
          count: comment.likes?.length || 0,
          hasLiked: comment.likes?.some(like => like.id === currentUserId) || false,
        };
      });
      setCommentLikes(commentLikesMap);
    }
  }, [blog?.comments, currentUserId]);

  const handleLike = async () => {
    // Store the current state for potential rollback
    const currentLikes = localLikes;
    const currentHasLiked = hasLiked;

    // Optimistic update
    const newHasLiked = !hasLiked;
    const newLikes = newHasLiked ? localLikes + 1 : localLikes - 1;

    setLocalLikes(newLikes);
    setHasLiked(newHasLiked);

    try {
      await likeBlog({
        variables: { id },
        update: (cache, { data }) => {
          // Update the cache with the new blog data
          if (data?.likeBlog) {
            cache.writeQuery({
              query: GET_BLOG_DETAILS,
              variables: { id },
              data: {
                getBlogById: data.likeBlog,
              },
            });
          }
        },
      });

      message.success(newHasLiked ? 'Blog liked!' : 'Blog unliked!');
    } catch (error) {
      // Revert optimistic update on error
      setLocalLikes(currentLikes);
      setHasLiked(currentHasLiked);
      message.error('Failed to update like status');
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      message.warning('Please enter a comment');
      return;
    }

    setIsSubmittingComment(true);
    try {
      await createComment({
        variables: { content: comment, blogId: id },
        refetchQueries: [{ query: GET_BLOG_DETAILS, variables: { id } }],
      });
      setComment('');
      setCommentKey(prev => prev + 1); // Force Editor re-render
      message.success('Comment added successfully!');
    } catch (error) {
      message.error('Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Edit functionality
  const handleEditBlog = () => {
    setEditContent(blog?.content || '');
    setEditTags(blog?.tags || []);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (
    values: BlogFormValues,
    { setSubmitting }: FormikHelpers<BlogFormValues>
  ) => {
    if (!editContent.trim()) {
      message.error('Content is required');
      setSubmitting(false);
      return;
    }

    try {
      await updateBlog({
        variables: {
          id,
          title: values.title,
          content: editContent,
          tags: values.tags,
        },
      });
      message.success('Blog updated successfully!');
      setIsEditModalOpen(false);
      await refetch();
    } catch (error) {
      message.error('Failed to update blog');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTagInput = (e: React.KeyboardEvent<HTMLInputElement>, setFieldValue: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      const newTag = target.value.trim();

      if (newTag && !editTags.includes(newTag)) {
        const updatedTags = [...editTags, newTag];
        setEditTags(updatedTags);
        setFieldValue('tags', updatedTags);
        setFieldValue('tagInput', '');
      }
    }
  };

  const removeEditTag = (index: number, setFieldValue: any) => {
    const updatedTags = editTags.filter((_, i) => i !== index);
    setEditTags(updatedTags);
    setFieldValue('tags', updatedTags);
  };

  // Delete blog functionality
  const handleDeleteBlog = async () => {
    const confirmed = await confirm.confirm({
      title: 'Delete Blog Post',
      message:
        'Are you sure you want to delete this blog post? This action cannot be undone and will permanently remove the blog along with all its comments and likes.',
      type: 'danger',
      confirmText: 'Delete Blog',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      try {
        await deleteBlog({ variables: { id } });
        message.success('Blog deleted successfully!');
        navigate('/blogs');
      } catch (error) {
        message.error('Failed to delete blog');
      }
    }
  };

  // Comment like functionality
  const handleCommentLike = async (commentId: string) => {
    const currentCommentLike = commentLikes[commentId];
    if (!currentCommentLike) return;

    // Optimistic update
    const newHasLiked = !currentCommentLike.hasLiked;
    const newCount = newHasLiked ? currentCommentLike.count + 1 : currentCommentLike.count - 1;

    setCommentLikes(prev => ({
      ...prev,
      [commentId]: {
        count: newCount,
        hasLiked: newHasLiked,
      },
    }));

    try {
      await likeComment({
        variables: { id: commentId },
        update: (cache, { data }) => {
          // Update the cache with the new comment data
          const existingBlog = cache.readQuery<{ getBlogById: Blog }>({
            query: GET_BLOG_DETAILS,
            variables: { id },
          });

          if (existingBlog?.getBlogById && data?.likeComment) {
            const updatedBlog = {
              ...existingBlog.getBlogById,
              comments: existingBlog.getBlogById.comments.map((comment: Comment) =>
                comment.id === commentId ? data.likeComment : comment
              ),
            };

            cache.writeQuery({
              query: GET_BLOG_DETAILS,
              variables: { id },
              data: {
                getBlogById: updatedBlog,
              },
            });
          }
        },
      });

      // Show a success message
      message.success(newHasLiked ? 'Comment liked!' : 'Comment unliked!');
    } catch (error) {
      // Revert optimistic update on error
      setCommentLikes(prev => ({
        ...prev,
        [commentId]: currentCommentLike,
      }));
      message.error('Failed to update comment like status');
    }
  };

  // Delete comment functionality
  const handleDeleteComment = async (commentId: string) => {
    const confirmed = await confirm.confirm({
      title: 'Delete Comment',
      message: 'Are you sure you want to delete this comment? This action cannot be undone.',
      type: 'danger',
      confirmText: 'Delete Comment',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      try {
        await deleteComment({
          variables: { id: commentId },
          update: cache => {
            // Update the cache by removing the deleted comment
            const existingBlog = cache.readQuery<{ getBlogById: Blog }>({
              query: GET_BLOG_DETAILS,
              variables: { id },
            });

            if (existingBlog?.getBlogById) {
              const updatedBlog = {
                ...existingBlog.getBlogById,
                comments: existingBlog.getBlogById.comments.filter(
                  (comment: Comment) => comment.id !== commentId
                ),
              };

              cache.writeQuery({
                query: GET_BLOG_DETAILS,
                variables: { id },
                data: {
                  getBlogById: updatedBlog,
                },
              });
            }
          },
        });
        message.success('Comment deleted successfully!');
      } catch (error: any) {
        if (error.message?.includes('Not authorized')) {
          message.error('You can only delete your own comments');
        } else {
          message.error('Failed to delete comment');
        }
      }
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-theme-primary pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button skeleton */}
          <Skeleton className="w-24 h-10 rounded-xl mb-8" />

          {/* Header skeleton */}
          <div className="mb-8">
            <Skeleton className="w-full h-12 rounded-xl mb-4" />
            <div className="flex items-center space-x-4 mb-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="w-32 h-4 rounded" />
                <Skeleton className="w-48 h-3 rounded" />
              </div>
            </div>
          </div>

          {/* Content skeleton */}
          <Skeleton className="w-full h-96 rounded-xl mb-8" />

          {/* Actions skeleton */}
          <div className="flex space-x-4 mb-8">
            <Skeleton className="w-24 h-10 rounded-xl" />
            <Skeleton className="w-32 h-10 rounded-xl" />
          </div>

          {/* Comments skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-theme-primary pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8"
          >
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Error Loading Blog
            </h2>
            <p className="text-red-500 dark:text-red-300 mb-6">
              {error.message || 'Failed to load blog details'}
            </p>
            <Button
              onClick={() => navigate('/blogs')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Back to Blogs
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-theme-primary pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/blogs')}
          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Blogs</span>
        </motion.button>

        {/* Blog Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-theme-primary leading-tight">
            {blog?.title}
          </h1>

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-3">
              {blog?.author?.profilePicture ? (
                <Avatar
                  size="large"
                  src={blog?.author?.profilePicture}
                  className="border-2 border-blue-200 dark:border-blue-800"
                />
              ) : (
                <Avatar
                  size="large"
                  className="bg-blue-600 text-white border-2 border-blue-200 dark:border-blue-800"
                >
                  {blog?.author?.username?.charAt(0)?.toUpperCase()}
                </Avatar>
              )}
              <div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="font-semibold text-theme-primary">{blog?.author?.username}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {moment(parseInt(blog?.createdAt as string)).format('MMMM DD, YYYY')} •{' '}
                    {moment(parseInt(blog?.createdAt as string)).fromNow()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tags and Edit Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {blog?.tags &&
                blog.tags.length > 0 &&
                blog.tags.map((tag: string, index: number) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Tag className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      #{tag}
                    </Tag>
                  </motion.div>
                ))}
            </div>

            {/* Edit and Delete Buttons - only show for blog author */}
            {blog?.author?.id === currentUserId && (
              <div className="flex gap-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    onClick={handleEditBlog}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 font-medium transition-all duration-200"
                    startContent={<Edit className="w-4 h-4" />}
                  >
                    Edit Blog
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Button
                    onClick={handleDeleteBlog}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 font-medium transition-all duration-200"
                    startContent={<Trash2 className="w-4 h-4" />}
                  >
                    Delete Blog
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Blog Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <MarkdownPreviewComponent content={blog?.content || ''} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 mb-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                startContent={
                  <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current text-red-500' : ''}`} />
                }
                onClick={handleLike}
                className={`${
                  hasLiked
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                } border transition-all duration-200`}
              >
                {localLikes} {localLikes === 1 ? 'Like' : 'Likes'}
              </Button>
            </motion.div>

            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <MessageCircle className="w-4 h-4" />
              <span className="font-medium">
                {blog?.comments?.length || 0}{' '}
                {blog?.comments?.length === 1 ? 'Comment' : 'Comments'}
              </span>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-theme-primary flex items-center">
                <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                Comments
                <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                  {blog?.comments?.length || 0}
                </span>
              </h2>
            </div>

            {blog?.comments && blog.comments.length > 0 ? (
              <div className="space-y-3">
                {blog.comments.map((comment: Comment, index: number) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-100 dark:border-gray-600 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700/50 transition-all duration-200"
                  >
                    <div className="flex items-start space-x-3">
                      {comment.author?.profilePicture ? (
                        <Avatar
                          size="default"
                          src={comment.author.profilePicture}
                          className="border-2 border-gray-200 dark:border-gray-600"
                        />
                      ) : (
                        <Avatar
                          size="default"
                          className="bg-blue-600 text-white border-2 border-gray-200 dark:border-gray-600 font-semibold"
                        >
                          {comment.author?.username?.charAt(0)?.toUpperCase()}
                        </Avatar>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-sm text-theme-primary">
                            {comment.author?.username}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {moment(parseInt(comment.createdAt)).fromNow()}
                          </span>
                        </div>

                        <div className="prose prose-sm dark:prose-invert max-w-none mb-3 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                          <MarkdownPreviewComponent content={comment.content} />
                        </div>

                        {/* Comment Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                size="sm"
                                variant="light"
                                startContent={
                                  <Heart
                                    className={`w-3 h-3 ${
                                      commentLikes[comment.id]?.hasLiked
                                        ? 'fill-current text-red-500'
                                        : 'text-gray-500 dark:text-gray-400'
                                    }`}
                                  />
                                }
                                onClick={() => handleCommentLike(comment.id)}
                                className={`${
                                  commentLikes[comment.id]?.hasLiked
                                    ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                } transition-all duration-200 min-w-0 px-2 py-1 text-xs`}
                              >
                                {commentLikes[comment.id]?.count || 0}
                              </Button>
                            </motion.div>

                            {/* Delete button - only show for comment author */}
                            {comment.author?.id === currentUserId && (
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  size="sm"
                                  variant="light"
                                  startContent={<Trash2 className="w-3 h-3" />}
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 min-w-0 px-2 py-1 text-xs"
                                >
                                  Delete
                                </Button>
                              </motion.div>
                            )}
                          </div>

                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            {moment(parseInt(comment.createdAt)).format('MMM DD, h:mm A')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  No comments yet
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Be the first to share your thoughts on this blog post.
                </p>
              </motion.div>
            )}
          </div>

          {/* Add Comment Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center mb-4">
              <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
              <h2 className="text-xl font-bold text-theme-primary">Leave a Comment</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                <Editor
                  key={commentKey}
                  initialContent={comment}
                  onChange={content => setComment(content)}
                  placeholder="Share your thoughts about this blog post..."
                  minHeight="150px"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Markdown formatting supported
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleCommentSubmit}
                    disabled={isSubmittingComment || !comment.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    isLoading={isSubmittingComment}
                    startContent={!isSubmittingComment && <MessageCircle className="w-4 h-4" />}
                  >
                    {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.main>
      </div>

      {/* Edit Blog Modal */}
      <BlogModal
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
        content={editContent}
        setContent={setEditContent}
        tags={editTags}
        setTags={setEditTags}
        handleTagInput={handleEditTagInput}
        removeTag={removeEditTag}
        mode="edit"
        editingBlog={blog}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};

export default BlogDetails;
