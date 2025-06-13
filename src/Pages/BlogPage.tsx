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
import {
  Skeleton,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react';
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
  const [createBlog] = useMutation(CREATE_BLOG_MUTATION, {
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
  const handleSubmit = async (
    value: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    if (content === '') {
      message.error('Content is required');
      setSubmitting(false);
      return;
    }
    try {
      await createBlog({ variables: { title: value.title, content: content, tags: value.tags } });
      resetForm();
      setContent('');
      setTags([]);
    } catch (err) {
      // Error is handled by the onError callback in the mutation
    }
    setSubmitting(false);
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
  // Only the JSX className and styles are modified for modern & dark styling enhancements

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 font-mono transition-colors duration-300">
      <main className="container mx-auto px-6 py-10 flex flex-col lg:flex-row gap-10">
        <div className="lg:w-3/4 space-y-10">
          <button
            className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-400 focus:outline-none text-white py-3 px-6 rounded-lg shadow-md flex items-center justify-center transition-all duration-200"
            onClick={() => setIsModalOpen(true)}
            aria-label="Write New Post"
          >
            <FaPenSquare className="mr-3" size={20} />
            Write New Post
          </button>

          {data?.getBlogs?.map((blog: Blog) => (
            <Skeleton
              isLoaded={!loading}
              key={blog?.id}
              className="dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center space-x-5 mb-5">
                <Avatar
                  size="large"
                  src={blog?.author?.profilePicture}
                  alt={blog?.author?.username}
                  className="border-2 border-emerald-500"
                />
                <div>
                  <h2
                    className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 hover:text-emerald-500 cursor-pointer transition-colors duration-200"
                    onClick={() => navigate(`/blog/${blog?.id}`)}
                  >
                    {blog?.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    by {blog?.author?.username} • {moment(parseInt(blog?.createdAt)).fromNow()}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                {blog?.content?.slice(0, 110)}...
              </p>

              <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                <div className="flex space-x-6">
                  <button
                    className={`flex items-center hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded transition-colors duration-200 ${
                      blog?.likes?.some(like => like.username === userData?.user?.username)
                        ? 'text-emerald-600'
                        : ''
                    }`}
                    onClick={() => handleLikeBlog(blog?.id)}
                    aria-label="Like blog"
                  >
                    <FaThumbsUp size={20} className="mr-2" />
                    {blog?.likes?.length}
                  </button>
                  <span className="flex items-center">
                    <FiMessageSquare size={20} className="mr-2" />
                    23
                  </span>
                </div>
                <button
                  className="flex items-center hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded transition-colors duration-200"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/blog/${blog?.id}`);
                    message.success('Link copied to clipboard');
                  }}
                  aria-label="Share blog link"
                >
                  <BsShare size={20} className="mr-2" />
                  Share
                </button>
              </div>
            </Skeleton>
          ))}
        </div>

        <aside className="lg:w-1/4 space-y-10">
          <section className="dark:bg-gray-800 bg-white border border-gray-300 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-5 text-gray-900 dark:text-gray-100">
              Popular Tags
            </h2>
            <div className="flex flex-wrap gap-3">
              {popularTags?.getPopularTags?.map((tag: PopularTag, idx: number) => (
                <span
                  key={idx}
                  className="bg-emerald-700 text-emerald-100 hover:bg-emerald-600 cursor-pointer px-3 py-1 rounded-full text-sm font-medium select-none transition-colors duration-200"
                  title={`#${tag.tag}`}
                >
                  #{tag.tag}
                </span>
              ))}
            </div>
          </section>

          <section className="dark:bg-gray-800 bg-white border border-gray-300 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-5 text-gray-900 dark:text-gray-100">
              Top Contributors
            </h2>
            <ul className="space-y-5">
              {topContributors?.topContributors?.map((contributor: TopContributor, idx: number) => (
                <li key={idx} className="flex items-center space-x-4">
                  <Avatar
                    size="large"
                    src={contributor.profilePicture}
                    alt={contributor.username}
                    className="border-2 border-emerald-500"
                  />
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {contributor.username}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </main>

      {/* Blog Creation Modal */}
      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen} size="2xl" scrollBehavior="inside">
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Create New Blog Post
                </h2>
              </ModalHeader>
              <ModalBody>
                <Formik
                  initialValues={initialValues}
                  validationSchema={BlogSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched, setFieldValue, isSubmitting }) => (
                    <Form className="space-y-6">
                      <div>
                        <label
                          htmlFor="title"
                          className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Title
                        </label>
                        <Field
                          type="text"
                          id="title"
                          name="title"
                          placeholder="Enter a title for your blog post"
                          className={`w-full px-3 py-2 text-gray-700 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:outline-none focus:border-emerald-500 dark:text-gray-300 dark:border-gray-600 ${
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
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Tags
                        </label>
                        <Field
                          type="text"
                          name="tagInput"
                          placeholder="Type a tag and press Enter"
                          className="w-full px-3 py-2 text-gray-700 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:outline-none focus:border-emerald-500 dark:text-gray-300 dark:border-gray-600"
                          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                            handleTagInput(e, setFieldValue)
                          }
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                          {tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(index, setFieldValue)}
                                className="ml-2 text-emerald-600 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-100"
                              >
                                <BsX size={16} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Content
                        </label>
                        <Editor
                          initialContent={content}
                          onChange={newContent => setContent(newContent)}
                          placeholder="Write your blog content here... Use the toolbar above for formatting!"
                          minHeight="350px"
                          maxHeight="500px"
                        />
                      </div>

                      <ModalFooter className="px-0">
                        <Button color="danger" variant="light" onPress={onClose}>
                          Cancel
                        </Button>
                        <Button
                          color="primary"
                          type="submit"
                          isLoading={isSubmitting}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          {isSubmitting ? 'Publishing...' : 'Publish Blog'}
                        </Button>
                      </ModalFooter>
                    </Form>
                  )}
                </Formik>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
