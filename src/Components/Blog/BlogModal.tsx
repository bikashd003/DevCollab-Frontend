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
      size="3xl"
      scrollBehavior="inside"
      backdrop="blur"
      classNames={{
        base: 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/20 dark:border-gray-700/20 shadow-2xl',
        header:
          'border-b border-gray-200/30 dark:border-gray-700/30 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-gray-800/50 dark:to-gray-700/50',
        body: 'py-6 px-0',
        footer:
          'border-t border-gray-200/30 dark:border-gray-700/30 bg-gray-50/30 dark:bg-gray-800/30',
      }}
    >
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1 px-8 py-6">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl ${
                    isEditMode
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {isEditMode ? <FiEdit className="w-5 h-5" /> : <FiPlus className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    {isEditMode
                      ? 'Update your blog post content and settings'
                      : 'Share your knowledge and insights with the community'}
                  </p>
                </div>
              </div>
            </ModalHeader>

            <ModalBody className="px-8">
              <Formik
                initialValues={initialValues}
                validationSchema={BlogSchema}
                onSubmit={onSubmit}
                enableReinitialize={isEditMode}
              >
                {({ errors, touched, setFieldValue }) => (
                  <Form className="space-y-8">
                    {/* Title Field */}
                    <div className="space-y-2">
                      <label
                        htmlFor={isEditMode ? 'edit-title' : 'title'}
                        className="block text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        Title <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        id={isEditMode ? 'edit-title' : 'title'}
                        name="title"
                        placeholder="Enter a compelling title for your blog post"
                        className={`w-full px-4 py-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-2 rounded-xl focus:outline-none transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 font-medium ${
                          errors.title && touched.title
                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 bg-red-50/30 dark:bg-red-900/10'
                            : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      />
                      <ErrorMessage
                        name="title"
                        component="div"
                        className="text-sm text-red-500 font-medium flex items-center gap-1"
                      />
                    </div>

                    {/* Tags Field */}
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                        Tags
                      </label>
                      <Field
                        type="text"
                        name="tagInput"
                        placeholder="Type a tag and press Enter (e.g., javascript, react, tutorial)"
                        className="w-full px-4 py-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 font-medium hover:border-gray-300 dark:hover:border-gray-500"
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                          handleTagInput(e, setFieldValue)
                        }
                      />

                      {/* Tags Display */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {getCurrentTags().map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50 hover:shadow-md transition-all duration-200 group"
                          >
                            <span className="mr-2">#</span>
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(index, setFieldValue)}
                              className="ml-2 text-blue-500 hover:text-red-500 dark:text-blue-400 dark:hover:text-red-400 transition-colors duration-200 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full p-0.5"
                            >
                              <BsX
                                size={16}
                                className="group-hover:scale-110 transition-transform"
                              />
                            </button>
                          </span>
                        ))}
                      </div>

                      {getCurrentTags().length === 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-dashed border-gray-300 dark:border-gray-600">
                          <FiPlus className="w-4 h-4" />
                          <span>Add tags to help others discover your blog post</span>
                        </div>
                      )}
                    </div>

                    {/* Content Field */}
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                        Content <span className="text-red-500">*</span>
                      </label>
                      <div className="border-2 border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden hover:border-gray-300 dark:hover:border-gray-500 transition-colors duration-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                        <Editor
                          initialContent={isEditMode ? editingBlog?.content || '' : content}
                          onChange={newContent => setContent(newContent)}
                          placeholder="Write your blog content here... Use the toolbar above for formatting!"
                          minHeight="400px"
                          maxHeight="600px"
                        />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Use markdown formatting for rich text content
                      </p>
                    </div>
                  </Form>
                )}
              </Formik>
            </ModalBody>

            <ModalFooter className="px-8 py-6">
              <Formik
                initialValues={initialValues}
                validationSchema={BlogSchema}
                onSubmit={onSubmit}
                enableReinitialize={isEditMode}
              >
                {({ isSubmitting, submitForm }) => (
                  <div className="flex justify-end gap-4 w-full">
                    <Button
                      variant="bordered"
                      onPress={onClose}
                      className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-2 font-semibold rounded-xl transition-all duration-300 hover:border-gray-400 dark:hover:border-gray-500"
                    >
                      Cancel
                    </Button>
                    <Button
                      onPress={submitForm}
                      isLoading={isSubmitting}
                      className={`px-8 py-2 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-white ${
                        isEditMode
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                      } hover:scale-105 active:scale-95`}
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
                )}
              </Formik>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default BlogModal;
