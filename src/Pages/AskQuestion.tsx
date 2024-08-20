import React, { useState } from 'react';
import { Steps, Input, Tag, Tooltip, message, Card, List } from 'antd';
import { CheckOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import * as yup from 'yup';
import QuestionEditor from '../Components/Global/QuestionsEditor';
import questionSchema from '../Schemas/QuestionSchema';

const { Step } = Steps;

interface FormData {
    title: string;
    content: string;
    tags: string[];
    category: string;
    isUrgent: boolean;
    expectedResponseTime: number;
    relatedLinks: string[];
}

interface FormErrors {
    [key: string]: string;
}

const QuestionInput: React.FC = () => {
    const [current, setCurrent] = useState(0);
    const [formData, setFormData] = useState<FormData>({
        title: '',
        content: '',
        tags: [],
        category: '',
        isUrgent: false,
        expectedResponseTime: 0,
        relatedLinks: [],
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const relatedQuestions = [
        'How to create a React component that fetches data from an API?',
        'What is the difference between let and const in JavaScript?',
        'How to implement a search feature in a React application?',
        'What is the purpose of the useEffect hook in React?',
    ];

    const validateStep = async (step: number) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let schemaToValidate: yup.ObjectSchema<any> = yup.object();
            switch (step) {
                case 0:
                    schemaToValidate = yup.object().shape({ title: questionSchema.fields.title });
                    break;
                case 1:
                    schemaToValidate = yup.object().shape({ content: questionSchema.fields.content });
                    break;
                case 2:
                    schemaToValidate = yup.object().shape({ tags: questionSchema.fields.tags });
                    break;
                default:
                    schemaToValidate = questionSchema;
            }
            await schemaToValidate.validate(formData, { abortEarly: false });
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
            if (current < 3) {
        setCurrent(current + 1);
            } else {
                // Submit the question
                console.log(formData);
                // Reset form after submission
                setFormData({
                    title: '',
                    content: '',
                    tags: [],
                    category: '',
                    isUrgent: false,
                    expectedResponseTime: 0,
                    relatedLinks: [],
                });
                setCurrent(0);
                message.success('Question submitted successfully!');
            }
        }
    };

    const handleInputChange = (field: keyof FormData, value: string | string[] | boolean | number) => {
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
    };

    const handleRemoveTag = (tagToRemove: string) => {
        handleInputChange('tags', formData.tags.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div className="bg-background dark:bg-dark-background p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Ask a Question</h2>
            <Steps current={current} type="navigation" size="small">
                <Step title="Title" />
                <Step title="Content" />
                <Step title="Tags" />
                <Step title="Related Questions" />
            </Steps>
            <form onSubmit={(e) => e.preventDefault()}>
                {current === 0 && (
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium mb-1">
                            Title
                        </label>
                        <Input
                            type="text"
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className={`w-full p-2 border rounded-md bg-background dark:bg-dark-background ${errors.title ? 'border-red-500' : ''
                                }`}
                            placeholder="Enter your question title"
                        />
                        {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                        <div className="mt-2 text-gray-500 dark:text-gray-400">
                            <Tooltip
                                title="Your title should be clear, concise, and describe the problem you're trying to solve."
                                placement="right"
                            >
                                <QuestionCircleOutlined className="mr-2" />
                                How to write a good question title
                            </Tooltip>
                        </div>
                    </div>
                )}
                {current === 1 && (
                    <div className="mb-4">
                        <div className="overflow-hidden">
                            <QuestionEditor
                                content={formData.content}
                                setContent={(content) => handleInputChange('content', content)}
                            />
                        </div>
                        {errors.content && <div className="text-red-500 text-sm mt-1">{errors.content}</div>}
                        <div className="mt-2 text-gray-500 dark:text-gray-400">
                            <Tooltip
                                title="Provide a detailed description of your problem, including any relevant code snippets or errors you're encountering."
                                placement="right"
                            >
                                <QuestionCircleOutlined className="mr-2" />
                                How to write a good question body
                            </Tooltip>
                        </div>
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
                            {formData.tags.map((tag) => (
                                <Tag
                                    key={tag}
                                    closable
                                    onClose={() => handleRemoveTag(tag)}
                                    className="mr-2 mb-2"
                                >
                                    {tag}
                                </Tag>
                            ))}
                            <Input
                                placeholder="Add a tag"
                                onPressEnter={(e) => handleAddTag((e.target as HTMLInputElement).value)}
                                className={`mr-2 mb-2 ${errors.tags ? 'border-red-500' : ''}`}
                            />
                        </div>
                        {errors.tags && <div className="text-red-500 text-sm mt-1">{errors.tags}</div>}
                    </div>
                )}
                {current === 3 && (
                    <div className="mb-4">
                        <Card>
                            <List
                                dataSource={relatedQuestions}
                                renderItem={(item) => (
                                    <List.Item>
                                        <a href="#" className="text-sm font-medium hover:underline underline-offset-4">
                                            {item}
                                        </a>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </div>
                )}
                <div className="flex justify-end">
                    {current > 0 && (
                        <button
                            type="button"
                            onClick={() => setCurrent(current - 1)}
                            className="px-4 py-2 mr-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                        >
                            Previous
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleNext}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        {current < 3 ? 'Next' : 'Submit Question'}
                        {current === 3 && <CheckOutlined className="ml-2" />}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default QuestionInput;
