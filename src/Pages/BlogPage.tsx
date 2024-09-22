import type { FormikHelpers } from 'formik';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import BlogSchema from '../Schemas/BlogSchema';
import { useState } from 'react';
import { BsShare, BsX } from 'react-icons/bs';
import { FaPenSquare, FaThumbsUp } from 'react-icons/fa';
import { FiMessageSquare } from 'react-icons/fi';
import { useQuery, useMutation } from '@apollo/client';
import { CREATE_BLOG_MUTATION } from '../GraphQL/Mutations/Blogs/Blogs';
import { Avatar, message } from 'antd';
import { LIKE_BLOG } from '../GraphQL/Mutations/Blogs/Blogs';
import { GET_BLOGS, GET_POPULAR_TAGS } from '../GraphQL/Queries/Blogs/Blog';
import moment from 'moment';
import { Skeleton } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import Editor from '../Components/Global/Editor';
import { GET_TOP_CONTRIBUTORS } from '../GraphQL/Queries/Blogs/Blog';
import { GET_USER_DATA } from '../GraphQL/Queries/Profile/Users';

type FormValues = { title: string; tags: string[]; tagInput: string };
interface Blog {
  id: number;
  title: string;
  content: string;
  likes: {
    username: string;
  }[];
  author: {
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
export default function BlogPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const navigate = useNavigate();
  const [likeBlog] = useMutation(LIKE_BLOG);
  const { loading, data, refetch } = useQuery(GET_BLOGS);
  const { data: userData } = useQuery(GET_USER_DATA);
  const { data: topContributors } = useQuery(GET_TOP_CONTRIBUTORS);
  const { data: popularTags } = useQuery(GET_POPULAR_TAGS);
  const initialValues: FormValues = { title: '', tags: [], tagInput: '' };
  const [createBlog, { error }] = useMutation(CREATE_BLOG_MUTATION, {
    onCompleted: () => {
      message.success('Blog created successfully');
      setIsModalOpen(false);
      setTags([]);
      refetch();
    },
    onError: err => {
      message.error(err.message);
    },
  });
  const handleSubmit = async (value: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    if (content === '') {
      message.error('Content is required');
      return;
    }
    await createBlog({ variables: { title: value.title, content: content, tags: value.tags } });
    if (error) return;
    // Handle form submission
    setSubmitting(false);
    setIsModalOpen(false);
  };
  const handleLikeBlog = async (id: number) => {
    await likeBlog({ variables: { id: id } });
    refetch();
  };
  const handleTagInput = (
    e: React.KeyboardEvent<HTMLInputElement>,
    setFieldValue: (_field: string, _value: unknown) => void
  ) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      setTags([...tags, newTag]);
      setFieldValue('tags', [...tags, newTag]);
      e.currentTarget.value = '';
      setFieldValue('tagInput', '');
    }
  };
  const removeTag = (
    indexToRemove: number,
    setFieldValue: (_field: string, _value: string[]) => void
  ) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    setFieldValue('tags', newTags);
  };
  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-dark-background dark:text-dark-foreground font-mono">
      <main className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/4 space-y-8">
          <button
            className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded flex items-center justify-center"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPenSquare className="mr-2" size={18} />
            Write New Post
          </button>

          {data?.getBlogs?.map((blog: Blog) => {
            return (
              <Skeleton
                isLoaded={!loading}
                className="dark:bg-dark-background border border-zinc-700 rounded-lg p-6"
                key={blog?.id}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-emerald-500 rounded-full">
                    {blog?.author?.profilePicture ? (
                      <Avatar
                        size="large"
                        src={blog?.author?.profilePicture}
                        alt={blog?.author?.username}
                      />
                    ) : (
                      <Avatar size="large">{blog?.author?.username?.charAt(0)}</Avatar>
                    )}
                  </div>
                  <div>
                    <h2
                      className="text-lg font-semibold  hover:text-emerald-500 cursor-pointer"
                      onClick={() => navigate(`/blog/${blog?.id}`)}
                    >
                      {blog?.title}
                    </h2>
                    <p className="text-sm text-zinc-400">
                      by {blog?.author?.username} • {moment(parseInt(blog?.createdAt)).fromNow()}
                    </p>
                  </div>
                </div>
                <p className="text-zinc-300 mb-4">{blog?.content?.slice(0, 100)}...</p>
                <div className="flex justify-between items-center text-zinc-400">
                  <div className="flex space-x-4">
                    <button
                      className={`flex items-center hover:text-emerald-500 ${
                        blog?.likes?.some(like => like.username === userData?.user?.username)
                          ? 'text-emerald-500'
                          : ''
                      }`}
                      onClick={() => handleLikeBlog(blog?.id)}
                    >
                      <FaThumbsUp size={18} className="mr-1" />
                      {blog?.likes?.length}
                    </button>
                    <span className="flex items-center hover:text-emerald-500 ">
                      <FiMessageSquare size={18} className="mr-1" />
                      23
                    </span>
                  </div>
                  <button
                    className="flex items-center hover:text-emerald-500"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/blog/${blog?.id}`);
                      message.success('Link copied to clipboard');
                    }}
                  >
                    <BsShare size={18} className="mr-1" />
                    Share
                  </button>
                </div>
              </Skeleton>
            );
          })}
        </div>

        <aside className="lg:w-1/4 space-y-8">
          <div className="dark:bg-dark-background border border-zinc-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Popular Tags</h2>
            <div className="flex flex-wrap gap-2">
              {popularTags?.getPopularTags?.map((tag: PopularTag, idx: number) => {
                return (
                  <span
                    key={idx}
                    className="bg-emerald-900 text-emerald-100 px-2 py-1 rounded text-sm"
                  >
                    #{tag.tag}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="dark:bg-dark-background border border-zinc-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Top Contributors</h2>
            <ul className="space-y-4">
              {topContributors?.topContributors?.map((contributor: TopContributor, idx: number) => {
                return (
                  <li key={idx} className="flex items-center space-x-4">
                    {contributor?.profilePicture ? (
                      <Avatar
                        size="large"
                        src={contributor?.profilePicture}
                        alt={contributor?.username}
                      />
                    ) : (
                      <Avatar size="large">{contributor?.username?.charAt(0)}</Avatar>
                    )}
                    <span>{contributor?.username}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-background text-foreground dark:bg-dark-background dark:text-dark-foreground p-6 rounded-lg w-full max-w-[76rem]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Write New Blog Post</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setTags([]);
                }}
                className="text-zinc-400 hover:text-zinc-100"
              >
                <BsX size={24} />
              </button>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={BlogSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, setFieldValue }) => (
                <Form className="space-y-4">
                  <div>
                    <label
                      htmlFor="title"
                      className="block mb-2 text-sm font-medium text-gray-700 dark:text-dark-foreground"
                    >
                      Title
                    </label>
                    <Field
                      type="text"
                      id="title"
                      name="title"
                      placeholder="Enter a title for your blog post"
                      className={`w-full px-3 py-2 text-gray-700 bg-gray-200 border rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 ${
                        errors.title && touched.title ? 'border-red-500' : ''
                      }`}
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="mt-1 text-sm text-red-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="content"
                      className="block mb-2 text-sm font-medium text-gray-700 dark:text-dark-foreground"
                    >
                      Content
                    </label>
                    <Editor initialContent={content} onChange={content => setContent(content)} />
                    <ErrorMessage
                      name="content"
                      component="div"
                      className="mt-1 text-sm text-red-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="tags"
                      className="block mb-2 text-sm font-medium text-gray-700 dark:text-dark-foreground"
                    >
                      Tags
                    </label>
                    <Field
                      type="text"
                      id="tagInput"
                      name="tagInput"
                      placeholder="Enter tags for your blog post"
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                        handleTagInput(e, setFieldValue)
                      }
                      className={`w-full px-3 py-2 text-gray-700 bg-gray-200 border rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600`}
                    />
                    <ErrorMessage
                      name="tags"
                      component="div"
                      className="mt-1 text-sm text-red-500"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-emerald-900 text-emerald-100 px-2 py-1 rounded text-sm flex items-center"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(index, setFieldValue)}
                            className="ml-2 text-emerald-300 hover:text-emerald-100"
                          >
                            <BsX size={18} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded"
                    >
                      Publish
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}
