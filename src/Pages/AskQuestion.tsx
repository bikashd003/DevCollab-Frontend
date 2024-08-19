import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import ReactMarkdown from 'react-markdown';
import RichTextEditor from '../Components/Global/RichTextEditor';


const QuestionInput: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [preview, setPreview] = useState(false);
    const [editorMode, setEditorMode] = useState<'markdown' | 'richtext'>('markdown');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle submission logic here
        console.log({ title, content, tags });
    };

    const renderEditor = () => {
        if (editorMode === 'markdown') {
            return (
                <MDEditor
                    value={content}
                    onChange={(val) => setContent(val || '')}
                    preview={preview ? 'preview' : 'edit'}
                    height={300}
                />
            );
        } else {
            return (
                <RichTextEditor
                />
            );
        }
    };

    return (
        <div className="bg-background dark:bg-dark-background p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Ask a Question</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded-md bg-background dark:bg-dark-background"
                        placeholder="Enter your question title"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="content" className="block text-sm font-medium mb-1">
                        Description
                    </label>
                    <div className="mb-2">
                        <button
                            type="button"
                            onClick={() => setEditorMode('markdown')}
                            className={`mr-2 px-3 py-1 rounded-md ${editorMode === 'markdown' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Markdown
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditorMode('richtext')}
                            className={`px-3 py-1 rounded-md ${editorMode === 'richtext' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Rich Text
                        </button>
                    </div>
                    <div className="border rounded-md overflow-hidden">
                        {renderEditor()}
                    </div>
                    {editorMode === 'markdown' && (
                        <button
                            type="button"
                            onClick={() => setPreview(!preview)}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            {preview ? 'Edit' : 'Preview'}
                        </button>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="tags" className="block text-sm font-medium mb-1">
                        Tags
                    </label>
                    <input
                        type="text"
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="w-full p-2 border rounded-md bg-background dark:bg-dark-background"
                        placeholder="Enter tags separated by commas"
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Submit Question
                </button>
            </form>
            {preview && editorMode === 'markdown' && (
                <div className="mt-4">
                    <h3 className="text-xl font-bold mb-2">Preview</h3>
                    <div className="border rounded-md p-4 bg-background dark:bg-dark-background">
                        <h2 className="text-2xl font-bold mb-2">{title}</h2>
                        <ReactMarkdown>{content}</ReactMarkdown>
                        <div className="mt-2">
                            {tags.split(',').map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
                                >
                                    {tag.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionInput;