import { CheckOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { Input, Steps, Tag, message } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import { FiHelpCircle, FiTag, FiEdit3, FiSend, FiArrowLeft, FiTrendingUp } from 'react-icons/fi';
import * as yup from 'yup';
import { ADD_QUESTION_MUTAION } from '../GraphQL/Mutations/Questions/Question';
import questionSchema from '../Schemas/QuestionSchema';
import Editor from '../Components/Global/Editor';

interface FormData {
  title: string;
  tags: string[];
}

interface FormErrors {
  [key: string]: string;
}

const QuestionInput: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createQuestion] = useMutation(ADD_QUESTION_MUTAION, {
    onCompleted: () => {
      setFormData({
        title: '',
        tags: [],
      });
      setContent('');
      setCurrent(0);
      setIsSubmitting(false);
      message.success('Question submitted successfully!');
    },
    onError: err => {
      setIsSubmitting(false);
      message.error(err.message);
    },
  });
  const [formData, setFormData] = useState<FormData>({
    title: '',
    tags: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const mostUsedTags = [
    'javascript',
    'react',
    'css',
    'node.js',
    'python',
    'typescript',
    'html',
    'vue',
  ];
  const recentQuestions = [
    'How to create a responsive layout with CSS Grid?',
    'What is the difference between let and const in JavaScript?',
    'How to implement authentication in a React application?',
    'Tips for optimizing website performance',
    'Best practices for React component optimization',
    'How to handle state management in large applications?',
  ];
  const validateStep = async (step: number) => {
    try {
      let schemaToValidate: yup.ObjectSchema<object> = yup.object();
      switch (step) {
        case 0:
          schemaToValidate = yup.object().shape({ title: questionSchema.fields.title });
          break;
        case 1:
          schemaToValidate = yup.object().shape({
            content: yup.string().required('Content is required'),
          });
          break;
        case 2:
          schemaToValidate = yup.object().shape({ tags: questionSchema.fields.tags });
          break;
        default:
          schemaToValidate = questionSchema;
      }
      if (step === 1) {
        await schemaToValidate.validate({ content }, { abortEarly: false });
      } else {
        await schemaToValidate.validate(formData, { abortEarly: false });
      }
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors: FormErrors = {};
        err.inner.forEach((validationError: yup.ValidationError) => {
          if (validationError.path) {
            newErrors[validationError.path] = validationError.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleNext = async () => {
    if (await validateStep(current)) {
      if (current < 2) {
        setCurrent(current + 1);
      } else {
        try {
          setIsSubmitting(true);
          await createQuestion({ variables: { ...formData, content } });
        } catch (error) {
          setIsSubmitting(false);
          // Handle error if needed
        }
      }
    }
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | string[] | boolean | number
  ) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddTag = (tag: string) => {
    if (formData.tags.length >= 5) {
      setErrors({ ...errors, tags: 'You can only add up to 5 tags.' });
      message.error('You can only add up to 5 tags.');
      return;
    }
    if (formData.tags.includes(tag)) {
      setErrors({ ...errors, tags: 'You have already added this tag.' });
      message.error('You have already added this tag.');
      return;
    }
    handleInputChange('tags', [...formData.tags, tag]);
    setTagInput(''); // Clear the input after adding the tag
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange(
      'tags',
      formData.tags.filter(tag => tag !== tagToRemove)
    );
  };
  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="h-20"></div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-8"
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-theme-primary mb-3">Ask a Question</h1>
          <p className="text-theme-muted text-lg max-w-2xl mx-auto">
            Get help from our community of developers. Be specific and clear about your problem.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="dark:bg-gray-800 rounded-lg flex-grow lg:w-2/3 p-8"
          >
            {/* Progress Steps */}
            <div className="mb-8">
              <Steps
                current={current}
                items={[
                  {
                    title: 'Title',
                    icon: <FiEdit3 className="w-4 h-4" />,
                    description: 'Describe your problem',
                  },
                  {
                    title: 'Content',
                    icon: <FiHelpCircle className="w-4 h-4" />,
                    description: 'Provide details',
                  },
                  {
                    title: 'Tags',
                    icon: <FiTag className="w-4 h-4" />,
                    description: 'Categorize your question',
                  },
                ]}
                className="custom-steps"
              />
            </div>

            <form onSubmit={e => e.preventDefault()} className="space-y-6">
              <AnimatePresence mode="wait">
                {current === 0 && (
                  <motion.div
                    key="title-step"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-semibold text-theme-primary mb-3"
                      >
                        <FiEdit3 className="inline w-4 h-4 mr-2" />
                        Question Title
                      </label>
                      <Input
                        type="text"
                        id="title"
                        value={formData.title}
                        onChange={e => handleInputChange('title', e.target.value)}
                        className={`dark:bg-gray-700 w-full text-lg ${
                          errors.title ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                        placeholder="e.g., How to implement authentication in React?"
                        size="large"
                      />
                      {errors.title && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-2 flex items-center"
                        >
                          <span className="w-4 h-4 mr-1">⚠️</span>
                          {errors.title}
                        </motion.div>
                      )}
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="dark:bg-gray-700 border-l-4 border-theme-accent p-4 rounded-r-lg"
                    >
                      <div className="flex items-start">
                        <FiHelpCircle className="w-5 h-5 text-theme-accent mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-theme-primary mb-2">
                            Tips for a great title:
                          </h4>
                          <ul className="text-sm text-theme-muted space-y-1">
                            <li>• Be specific and describe the actual problem</li>
                            <li>• Include relevant technologies (React, JavaScript, etc.)</li>
                            <li>• Avoid vague words like "doesn't work" or "broken"</li>
                            <li>• Keep it under 150 characters</li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
                {current === 1 && (
                  <motion.div
                    key="content-step"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-theme-primary mb-3">
                        <FiHelpCircle className="inline w-4 h-4 mr-2" />
                        Question Details
                      </label>
                      <div className="border border-theme-primary rounded-lg overflow-hidden bg-theme-secondary">
                        <Editor
                          initialContent={content}
                          onChange={content => setContent(content)}
                        />
                      </div>
                      {errors.content && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-2 flex items-center"
                        >
                          <span className="w-4 h-4 mr-1">⚠️</span>
                          {errors.content}
                        </motion.div>
                      )}
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="dark:bg-gray-700 border-l-4  p-4 rounded-r-lg"
                    >
                      <div className="flex items-start">
                        <FiHelpCircle className="w-5 h-5 text-theme-accent mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-theme-primary mb-2">
                            Writing a detailed question:
                          </h4>
                          <ul className="text-sm text-theme-muted space-y-1">
                            <li>• Explain what you're trying to achieve</li>
                            <li>• Include relevant code snippets</li>
                            <li>• Describe what you've already tried</li>
                            <li>• Mention any error messages you're seeing</li>
                            <li>• Provide context about your environment</li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
                {current === 2 && (
                  <motion.div
                    key="tags-step"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-theme-primary mb-3">
                        <FiTag className="inline w-4 h-4 mr-2" />
                        Tags ({formData.tags.length}/5)
                      </label>

                      {/* Selected Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {formData.tags.map(tag => (
                          <motion.div
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Tag
                              closable
                              onClose={() => handleRemoveTag(tag)}
                              className="dark:bg-gray-700 text-white border-theme-accent px-3 py-1 text-sm font-medium hover:bg-theme-primary transition-colors"
                            >
                              {tag}
                            </Tag>
                          </motion.div>
                        ))}
                      </div>

                      {/* Tag Input */}
                      <Input
                        placeholder="Type a tag and press Enter"
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onPressEnter={e => {
                          e.preventDefault();
                          if (tagInput.trim()) {
                            handleAddTag(tagInput.trim());
                          }
                        }}
                        className={`dark:bg-gray-700 w-full ${
                          errors.tags ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                        size="large"
                        disabled={formData.tags.length >= 5}
                      />

                      {errors.tags && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-2 flex items-center"
                        >
                          <span className="w-4 h-4 mr-1">⚠️</span>
                          {errors.tags}
                        </motion.div>
                      )}
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="dark:bg-gray-700 border-l-4 border-theme-accent p-4 rounded-r-lg"
                    >
                      <div className="flex items-start">
                        <FiTag className="w-5 h-5 text-theme-accent mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-theme-primary mb-2">Tag guidelines:</h4>
                          <ul className="text-sm text-theme-muted space-y-1">
                            <li>• Use existing tags when possible</li>
                            <li>• Include the main technology (react, javascript, etc.)</li>
                            <li>• Add specific frameworks or libraries</li>
                            <li>• Maximum 5 tags per question</li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Navigation Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-between items-center pt-6 border-t border-theme-primary"
              >
                <div>
                  {current > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setCurrent(current - 1)}
                      className="btn-theme-secondary flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200"
                    >
                      <FiArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </motion.button>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="btn-theme-primary flex items-center px-8 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      {current < 2 ? 'Next Step' : 'Submit Question'}
                      {current === 2 ? (
                        <FiSend className="w-4 h-4 ml-2" />
                      ) : (
                        <CheckOutlined className="ml-2" />
                      )}
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:w-1/3 space-y-6"
          >
            {/* Popular Tags */}
            <div className="dark:bg-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <FiTrendingUp className="w-5 h-5 text-theme-accent mr-2" />
                <h3 className="text-lg font-bold text-theme-primary">Popular Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {mostUsedTags.map((tag, index) => (
                  <motion.button
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (
                        current === 2 &&
                        formData.tags.length < 5 &&
                        !formData.tags.includes(tag)
                      ) {
                        handleAddTag(tag);
                      }
                    }}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 ${
                      current === 2 && !formData.tags.includes(tag) && formData.tags.length < 5
                        ? 'border-theme-accent text-theme-accent hover:bg-theme-accent hover:text-white cursor-pointer'
                        : 'border-theme-muted text-theme-muted cursor-default'
                    }`}
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>
              {current === 2 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-theme-muted mt-3"
                >
                  Click on tags to add them to your question
                </motion.p>
              )}
            </div>

            {/* Recent Questions */}
            <div className="dark:bg-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <FiHelpCircle className="w-5 h-5 text-theme-accent mr-2" />
                <h3 className="text-lg font-bold text-theme-primary">Recent Questions</h3>
              </div>
              <div className="space-y-3">
                {recentQuestions.slice(0, 5).map((question, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <a
                      href="#"
                      className="block text-sm text-theme-muted hover:text-theme-accent transition-colors duration-200 line-clamp-2 group-hover:underline"
                    >
                      {question}
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuestionInput;
