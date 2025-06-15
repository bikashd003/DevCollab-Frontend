import type { FormikHelpers } from 'formik';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import BlogSchema from '../../Schemas/BlogSchema';
import React from 'react';
import { BsX } from 'react-icons/bs';
import { FiEdit3, FiEdit, FiPlus } from 'react-icons/fi';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react';
import Editor from '../Global/Editor';

// Type definitions
interface BlogFormValues {
  title: string;
  tags: string[];
  tagInput: string;
}

interface Blog {
  id: string | number;
  title: string;
  content: string;
  tags: string[];
  author?: {
    id: string;
    username: string;
    profilePicture?: string;
  };
  createdAt?: string;
}

interface BlogModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  content: string;
  setContent: (content: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  handleTagInput: (e: React.KeyboardEvent<HTMLInputElement>, setFieldValue: any) => void;
  removeTag: (index: number, setFieldValue: any) => void;
  mode: 'create' | 'edit';
  editingBlog?: Blog | null;
  onSubmit: (values: BlogFormValues, formikHelpers: FormikHelpers<BlogFormValues>) => void;
}

const BlogModal: React.FC<BlogModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  content,
  setContent,
  tags,
  handleTagInput,
  removeTag,
  mode = 'create',
  editingBlog = null,
  onSubmit,
}) => {
  const isEditMode = mode === 'edit';

  // Determine initial values based on mode
  const initialValues: BlogFormValues = {
    title: isEditMode ? editingBlog?.title || '' : '',
    tags: isEditMode ? editingBlog?.tags || [] : tags,
    tagInput: '',
  };

  // Get current tags for display
  const getCurrentTags = () => {
    return isEditMode ? editingBlog?.tags || [] : tags;
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onOpenChange={setIsModalOpen}
      size="4xl"
      scrollBehavior="inside"
      classNames={{
        base: 'bg-white dark:bg-gray-900',
        header: 'border-b border-gray-200 dark:border-gray-700',
        body: 'py-6',
        footer: 'border-t border-gray-200 dark:border-gray-700',
      }}
    >
      <ModalContent>
        {onClose => (
          <Formik
            initialValues={initialValues}
            validationSchema={BlogSchema}
            onSubmit={onSubmit}
            enableReinitialize={isEditMode}
          >
            {({ errors, touched, setFieldValue, isSubmitting }) => (
              <Form>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isEditMode
                          ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                          : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {isEditMode ? <FiEdit className="w-5 h-5" /> : <FiPlus className="w-5 h-5" />}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {isEditMode
                          ? 'Update your blog post content and settings'
                          : 'Share your knowledge and insights with the community'}
                      </p>
                    </div>
                  </div>
                </ModalHeader>

                <ModalBody className="space-y-6">
                  {/* Title Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor={isEditMode ? 'edit-title' : 'title'}
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Title <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="text"
                      id={isEditMode ? 'edit-title' : 'title'}
                      name="title"
                      placeholder="Enter a compelling title for your blog post"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.title && touched.title
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                      } text-gray-900 dark:text-white`}
                    />
                    <ErrorMessage name="title" component="div" className="text-sm text-red-500" />
                  </div>

                  {/* Tags Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">
                      Tags
                    </label>
                    <Field
                      type="text"
                      name="tagInput"
                      placeholder="Type a tag and press Enter"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                        handleTagInput(e, setFieldValue)
                      }
                    />

                    {/* Tags Display */}
                    {getCurrentTags().length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {getCurrentTags().map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                          >
                            #{tag}
                            <button
                              type="button"
                              onClick={() => removeTag(index, setFieldValue)}
                              className="ml-2 text-blue-500 hover:text-red-500 dark:text-blue-400 dark:hover:text-red-400"
                            >
                              <BsX size={16} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Content Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">
                      Content <span className="text-red-500">*</span>
                    </label>
                    <Editor
                      initialContent={isEditMode ? editingBlog?.content || '' : content}
                      onChange={newContent => setContent(newContent)}
                      placeholder="Write your blog content here..."
                      minHeight="120px"
                      maxHeight="250px"
                    />
                  </div>
                </ModalBody>

                <ModalFooter>
                  <div className="flex justify-end gap-3 w-full">
                    <Button
                      variant="bordered"
                      onPress={onClose}
                      className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      className={`text-white ${
                        isEditMode
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                      startContent={
                        !isSubmitting &&
                        (isEditMode ? (
                          <FiEdit className="w-4 h-4" />
                        ) : (
                          <FiEdit3 className="w-4 h-4" />
                        ))
                      }
                    >
                      {isSubmitting
                        ? isEditMode
                          ? 'Updating...'
                          : 'Publishing...'
                        : isEditMode
                          ? 'Update Blog'
                          : 'Publish Blog'}
                    </Button>
                  </div>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        )}
      </ModalContent>
    </Modal>
  );
};

export default BlogModal;
