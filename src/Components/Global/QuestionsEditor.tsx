import React, { useContext, useEffect, useState } from "react";
import MDEditor, { ICommand, EditorContext } from "@uiw/react-md-editor";
import { MdPreview, MdEdit, MdPlayArrow } from "react-icons/md";

const PreviewToggleButton: React.FC = () => {
    const { preview, dispatch } = useContext(EditorContext);

    const handleClick = () => {
        dispatch?.({
            preview: preview === "edit" ? "preview" : "edit"
        });
    };

    return (
        <button
            onClick={handleClick}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={preview === "edit" ? "Show Preview" : "Show Editor"}
        >
            {preview === "edit" ? (
                <MdPreview className="text-gray-600 dark:text-gray-300" size={16} title="Preview" />
            ) : (
                <MdEdit className="text-gray-600 dark:text-gray-300" size={16} title="Edit" />
            )}
        </button>
    );
};

const LivePreviewToggleButton: React.FC = () => {
    const { preview, dispatch } = useContext(EditorContext);

    const handleClick = () => {
        dispatch?.({
            preview: preview === "live" ? "edit" : "live"
        });
    };

    return (
        <button
            onClick={handleClick}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={preview === "live" ? "Hide Live Preview" : "Show Live Preview"}
        >
            <MdPlayArrow
                className={`text-gray-600 dark:text-gray-300 ${preview === "live" ? 'rotate-90' : ''}`}
                size={16}
                title={preview === "live" ? "Hide Live Preview" : "Show Live Preview"}
            />
        </button>
    );
};

const codePreview: ICommand = {
    name: "preview",
    keyCommand: "preview",
    value: "preview",
    icon: <PreviewToggleButton />
};

const codeLivePreview: ICommand = {
    name: "livePreview",
    keyCommand: "livePreview",
    value: "live",
    icon: <LivePreviewToggleButton />
};

interface QuestionEditorProps {
    content: string;
    setContent: (content: string) => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ content, setContent }) => {
    const [colorMode, setColorMode] = useState(localStorage.getItem('theme'));

    useEffect(() => {
        const handleThemeChange = () => {
            setColorMode(localStorage.getItem('theme'));
        };
        window.addEventListener('themeChange', handleThemeChange);
        return () => {
            window.removeEventListener('themeChange', handleThemeChange);
        };
    }, []);

    return (
        <div className="border w-1/3" data-color-mode={colorMode}>
            <MDEditor
                value={content}
                preview="edit"
                extraCommands={[codePreview, codeLivePreview]}
                onChange={(val) => setContent(val ?? '')}
                enableScroll={true}
            />
        </div>
    );
}

export default QuestionEditor;