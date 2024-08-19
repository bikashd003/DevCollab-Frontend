import React, { useState, useRef, useEffect } from 'react';

interface EditorProps {
    initialContent?: string;
    onChange?: (content: string) => void;
}

const RichTextEditor: React.FC<EditorProps> = ({ initialContent = '', onChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [content, setContent] = useState(initialContent);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = content;
        }
    }, []);

    const handleInput = () => {
        if (editorRef.current) {
            const newContent = editorRef.current.innerHTML;
            setContent(newContent);
            onChange && onChange(newContent);
        }
    };

    const execCommand = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    };

    return (
        <div className="border rounded-md overflow-hidden">
            <div className="bg-gray-100 p-2 border-b">
                <button onClick={() => execCommand('bold')} className="px-2 py-1 mr-1 border rounded">
                    B
                </button>
                <button onClick={() => execCommand('italic')} className="px-2 py-1 mr-1 border rounded">
                    I
                </button>
                <button onClick={() => execCommand('underline')} className="px-2 py-1 mr-1 border rounded">
                    U
                </button>
                <button onClick={() => execCommand('formatBlock', 'H1')} className="px-2 py-1 mr-1 border rounded">
                    H1
                </button>
                <button onClick={() => execCommand('formatBlock', 'H2')} className="px-2 py-1 mr-1 border rounded">
                    H2
                </button>
                <button onClick={() => execCommand('insertUnorderedList')} className="px-2 py-1 mr-1 border rounded">
                    UL
                </button>
                <button onClick={() => execCommand('insertOrderedList')} className="px-2 py-1 mr-1 border rounded">
                    OL
                </button>
            </div>
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                className="p-4 min-h-[200px] focus:outline-none"
            />
        </div>
    );
};

export default RichTextEditor;
// import React, { useState } from 'react';
// import { LexicalComposer } from '@lexical/react/LexicalComposer';
// import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
// import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
// import { ContentEditable } from '@lexical/react/LexicalContentEditable';
// import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
// import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
// import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
// import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin';
// import { TRANSFORMERS } from '@lexical/markdown';

// const editorConfig = {
//   namespace: 'MyEditor',
//   onError: (error: Error) => {
//     console.error(error);
//   },
// };

// const RichTextEditor: React.FC = () => {
//   const [editorState, setEditorState] = useState<string>('');
//   const [isMarkdown, setIsMarkdown] = useState(false);

//   const onChange = (editorState: any) => {
//     // Handle the editor state change here
//     editorState.read(() => {
//       const htmlContent = editorState.getEditorState().toJSON();
//       setEditorState(htmlContent);
//     });
//   };

//   return (
//     <LexicalComposer initialConfig={editorConfig}>
//       <div>
//         <button onClick={() => setIsMarkdown(!isMarkdown)}>
//           Switch to {isMarkdown ? 'Rich Text' : 'Markdown'}
//         </button>
//       </div>
//       <div className="editor-container">
//         <RichTextPlugin
//           contentEditable={<ContentEditable className="editor" />}
//           placeholder={<div>Enter text...</div>}
//         />
//         {isMarkdown && <MarkdownShortcutPlugin transformers={TRANSFORMERS} />}
//         <OnChangePlugin onChange={onChange} />
//         <HistoryPlugin />
//         <LinkPlugin />
//         <AutoLinkPlugin />
//       </div>
//     </LexicalComposer>
//   );
// };

// export default RichTextEditor;

