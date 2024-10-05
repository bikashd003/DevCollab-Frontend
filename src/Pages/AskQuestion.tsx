import { CheckOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { Input, List, Steps, Tag, Tooltip, message } from 'antd';
import React, { useState } from 'react';
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
  const [createQuestion] = useMutation(ADD_QUESTION_MUTAION, {
    onCompleted: () => {
      setFormData({
        title: '',
        tags: [],
      });
      setCurrent(0);
      message.success('Question submitted successfully!');
    },
    onError: err => {
      message.error(err.message);
    },
  });
  const [formData, setFormData] = useState<FormData>({
    title: '',
    tags: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const mostUsedTags = ['javascript', 'react', 'css', 'node.js', 'python'];
  const recentQuestions = [
    'How to create a responsive layout with CSS Grid?',
    'What is the difference between let and const in JavaScript?',
    'How to implement authentication in a React application?',
    'Tips for optimizing website performance',
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
          await createQuestion({ variables: { ...formData, content } });
        } catch (error) {
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
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground p-6 rounded-lg shadow-lg flex-grow lg:w-2/3">
          <div>
            <Steps
              current={current}
              items={[{ title: 'Add title' }, { title: 'Add content' }, { title: 'Add tag' }]}
              className="custom-steps"
            />
            <form onSubmit={e => e.preventDefault()} className="mt-4">
              {current === 0 && (
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <Input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={e => handleInputChange('title', e.target.value)}
                    className={`w-full p-2 border rounded-md bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground ${
                      errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    }`}
                    placeholder="Enter your question title"
                  />
                  {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                  <Tooltip
                    title="Your title should be clear, concise, and describe the problem you're trying to solve."
                    placement="right"
                  >
                    <div className="mt-2 text-gray-600 dark:text-gray-400 flex items-center">
                      <QuestionCircleOutlined className="mr-2" />
                      How to write a good question title
                    </div>
                  </Tooltip>
                </div>
              )}
              {current === 1 && (
                <div className="mb-4">
                  <div className="overflow-hidden">
                    <Editor initialContent={content} onChange={content => setContent(content)} />
                  </div>
                  {errors.content && (
                    <div className="text-red-500 text-sm mt-1">{errors.content}</div>
                  )}
                  <Tooltip
                    title="Provide a detailed description of your problem, including any relevant code snippets or errors you're encountering."
                    placement="right"
                  >
                    <div className="mt-2 text-gray-600 dark:text-gray-400 flex items-center">
                      <QuestionCircleOutlined className="mr-2" />
                      How to write a good question body
                    </div>
                  </Tooltip>
                </div>
              )}
              {current === 2 && (
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <label htmlFor="tags" className="block text-sm font-medium mr-2">
                      Tags
                    </label>
                    <Tooltip
                      title="Tags help categorize your question and make it easier for others to find. Add up to 5 tags that best describe your problem."
                      placement="right"
                    >
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </div>
                  <div className="flex flex-wrap">
                    {formData.tags.map(tag => (
                      <Tag
                        key={tag}
                        closable
                        onClose={() => handleRemoveTag(tag)}
                        className="mr-2 mb-2 bg-gray-200 dark:bg-gray-700 text-foreground dark:text-dark-foreground"
                      >
                        {tag}
                      </Tag>
                    ))}
                    <Input
                      placeholder="Add a tag"
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onPressEnter={e => {
                        e.preventDefault();
                        handleAddTag(tagInput);
                      }}
                      className={`mr-2 mb-2 bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground border-gray-300 dark:border-gray-700 ${
                        errors.tags ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                  {errors.tags && <div className="text-red-500 text-sm mt-1">{errors.tags}</div>}
                </div>
              )}
              <div className="flex justify-end">
                {current > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrent(current - 1)}
                    className="px-4 py-2 mr-2 bg-gray-200 dark:bg-gray-700 text-foreground dark:text-dark-foreground rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Previous
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {current < 2 ? 'Next' : 'Submit Question'}
                  {current === 2 && <CheckOutlined className="ml-2" />}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground p-6 rounded-lg shadow-lg lg:w-1/3">
          <h3 className="text-xl font-bold mb-4">Most Used Tags</h3>
          <div className="flex flex-wrap">
            {mostUsedTags.map(tag => (
              <Tag
                key={tag}
                className="mr-2 mb-2 bg-gray-200 dark:bg-gray-700 text-foreground dark:text-dark-foreground"
              >
                {tag}
              </Tag>
            ))}
          </div>
          <h3 className="text-xl font-bold mt-6 mb-4">Recently Added Questions</h3>
          <List
            dataSource={recentQuestions}
            renderItem={item => (
              <List.Item>
                <a
                  href="#"
                  className="text-sm font-medium hover:underline underline-offset-4 text-blue-600 dark:text-blue-400"
                >
                  {item}
                </a>
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionInput;
