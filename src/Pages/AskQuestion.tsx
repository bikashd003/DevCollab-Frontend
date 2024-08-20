import React, { useState } from 'react';
import { Steps, Input, Tag, Tooltip, message } from 'antd';
import { CheckOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import QuestionEditor from '../Components/Global/QuestionsEditor';
const { Step } = Steps;

const QuestionInput: React.FC = () => {
    const [current, setCurrent] = useState(0);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    const handleNext = () => {
        if (current === 0 && !title) {
            message.error('Please enter a title for your question.');
            return;
        }
        setCurrent(current + 1);
    };

    const handleAddTag = (tag: string) => {
        if (tags.length >= 5) {
            message.error('You can only add up to 5 tags.');
            return;
        }
        if (tags.includes(tag)) {
            message.error('You have already added this tag.');
            return;
        }
        setTags([...tags, tag]);
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle submission logic here
        console.log({ title, content, tags });
    };

    return (
        <div className="bg-background dark:bg-dark-background p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Ask a Question</h2>
            <Steps current={current}>
                <Step title="Title" />
                <Step title="Content" />
                <Step title="Tags" />
            </Steps>
            <form onSubmit={handleSubmit}>
                {current === 0 && (
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium mb-1">
                            Title
                        </label>
                        <Input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border rounded-md bg-background dark:bg-dark-background"
                            placeholder="Enter your question title"
                            required
                        />
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
                                content={content}
                                setContent={setContent}
                            />
                        </div>
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
                            {tags.map((tag) => (
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
                                className="mr-2 mb-2"
                            />
                        </div>
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
                    {current < 2 ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                                Submit Question <CheckOutlined />
                            </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default QuestionInput;