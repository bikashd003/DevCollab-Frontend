import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import type { ChainedCommands } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { FaRegEye, FaMarkdown } from 'react-icons/fa';
import { GrBlockQuote } from 'react-icons/gr';
import { MdOutlineFormatStrikethrough } from 'react-icons/md';
import { IoCodeSlashSharp, IoCodeWorkingOutline } from 'react-icons/io5';
import { MdFormatListBulleted } from 'react-icons/md';
import { RiListOrdered } from 'react-icons/ri';
import { useTheme } from '../../Context/ThemeProvider';
import { BiBold, BiItalic } from 'react-icons/bi';
interface EditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}
type EditorCommand = keyof ChainedCommands;

interface ButtonConfig {
  command: EditorCommand;
  icon: React.ElementType;
  active: string;
  markdown: string;
  title: string;
}
interface ToolbarButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isActive: boolean;
  icon: React.ElementType;
  disabled?: boolean;
  title?: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  isActive,
  icon: Icon,
  disabled = false,
  title = '',
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded ${isActive ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
  >
    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-500' : 'text-gray-500'}`} />
  </button>
);

const MenuBar: React.FC<{
  editor: ReturnType<typeof useEditor>;
  isMarkdownMode: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}> = ({ editor, isMarkdownMode, textareaRef }) => {
  if (!editor) return null;

  const buttons: ButtonConfig[] = [
    { command: 'toggleBold', icon: BiBold, active: 'bold', markdown: '**', title: 'Bold' },
    { command: 'toggleItalic', icon: BiItalic, active: 'italic', markdown: '_', title: 'Italic' },
    {
      command: 'toggleStrike',
      icon: MdOutlineFormatStrikethrough,
      active: 'strike',
      markdown: '~~',
      title: 'Strike',
    },
    { command: 'toggleCode', icon: IoCodeSlashSharp, active: 'code', markdown: '`', title: 'Code' },
    {
      command: 'toggleBulletList',
      icon: MdFormatListBulleted,
      active: 'bulletList',
      markdown: '- ',
      title: 'Bullet List',
    },
    {
      command: 'toggleOrderedList',
      icon: RiListOrdered,
      active: 'orderedList',
      markdown: '1. ',
      title: 'Ordered List',
    },
    {
      command: 'toggleCodeBlock',
      icon: IoCodeWorkingOutline,
      active: 'codeBlock',
      markdown: '```\n',
      title: 'Code Block',
    },
    {
      command: 'toggleBlockquote',
      icon: GrBlockQuote,
      active: 'blockquote',
      markdown: '> ',
      title: 'Blockquote',
    },
  ];

  const insertMarkdown = (markdown: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const selected = text.substring(start, end);
      const after = text.substring(end, text.length);

      let newText;
      let newCursorPos;

      if (start === end) {
        // No selection, insert markdown and place cursor in between
        newText = before + markdown + markdown + after;
        newCursorPos = start + markdown.length;
      } else {
        // Wrap selection with markdown
        newText = before + markdown + selected + markdown + after;
        newCursorPos = end + 2 * markdown.length;
      }

      textarea.value = newText;
      textarea.selectionStart = newCursorPos;
      textarea.selectionEnd = newCursorPos;
      textarea.focus();

      // Trigger onChange event
      const event = new Event('input', { bubbles: true });
      textarea.dispatchEvent(event);
    }
  };
  return (
    <div className="flex space-x-2">
      {buttons.map(({ command, icon, active, markdown, title }) => (
        <ToolbarButton
          key={command}
          onClick={() => {
            if (isMarkdownMode) {
              insertMarkdown(markdown);
            } else {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (editor.chain().focus()[command as keyof typeof editor.chain] as any)().run();
            }
          }}
          isActive={isMarkdownMode ? false : editor.isActive(active)}
          icon={icon}
          title={title}
        />
      ))}
    </div>
  );
};
const Editor: React.FC<EditorProps> = ({ initialContent = '', onChange }) => {
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const [markdownContent, setMarkdownContent] = useState(initialContent);
  const [showPreview, setShowPreview] = useState(false);
  const { theme } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Markdown,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const markdown = editor.storage.markdown.getMarkdown();
      setMarkdownContent(markdown);
      onChange?.(markdown);
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none mt-4 prose dark:prose-invert max-w-none',
      },
    },
    // autofocus: 'end',
    enableInputRules: true,
    enablePasteRules: true,
  });

  useEffect(() => {
    if (editor && !isMarkdownMode) {
      const { from, to } = editor.state.selection;
      editor.commands.setContent(initialContent || '<p></p>');
      editor.commands.setTextSelection({ from, to });
    }
    if (!isMarkdownMode) {
      setShowPreview(false);
    }
  }, [editor, initialContent, isMarkdownMode]);

  const togglePreview = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPreview(prev => !prev);
  }, []);
  const toggleMarkdownMode = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setIsMarkdownMode(prev => !prev);
      if (editor) {
        const content = isMarkdownMode ? editor.getHTML() : editor.storage.markdown.getMarkdown();
        if (isMarkdownMode) {
          editor.commands.setContent(content);
        } else {
          setMarkdownContent(content);
        }
      }
    },
    [editor, isMarkdownMode]
  );

  const handleMarkdownChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = e.target.value;
      setMarkdownContent(newContent);
      onChange?.(newContent);
    },
    [onChange]
  );

  if (!editor) return null;

  return (
    <div className="custom-scrollbar rounded-xl w-full border-2 px-2 dark:border-gray-300 border-gray-700 overflow-y-auto max-h-[300px] h-[300px]">
      <div className="w-full sticky top-0 py-2 z-10 bg-white dark:bg-dark-background rounded-xl mb-2">
        <div className="flex justify-between items-center">
          <MenuBar editor={editor} isMarkdownMode={isMarkdownMode} textareaRef={textareaRef} />
          <div className="flex  bg-slate-200 rounded-lg">
            <ToolbarButton
              onClick={toggleMarkdownMode}
              isActive={isMarkdownMode}
              icon={FaMarkdown}
              title="Markdown Mode"
            />
            <ToolbarButton
              onClick={togglePreview}
              isActive={showPreview}
              icon={FaRegEye}
              title="Live Preview"
              disabled={!isMarkdownMode}
            />
          </div>
        </div>
      </div>
      <div className="mt-2 px-2">
        {isMarkdownMode ? (
          <div className={`flex ${showPreview ? 'space-x-4' : ''} h-full`}>
            <textarea
              ref={textareaRef}
              className={`p-2 focus:outline-none resize-none ${
                showPreview ? 'w-1/2' : 'w-full h-full'
              }`}
              rows={9}
              value={markdownContent}
              onChange={handleMarkdownChange}
            />
            {showPreview && (
              <>
                <div className="w-px bg-gray-300 dark:bg-gray-600"></div>
                <div className="w-1/2 p-2 dark:border-gray-600 overflow-auto">
                  <MarkdownPreview
                    style={{ padding: 16, backgroundColor: 'transparent' }}
                    className="dark:bg-transparent text-foreground"
                    source={markdownContent}
                    wrapperElement={{
                      'data-color-mode': theme === 'dark' ? 'dark' : 'light',
                    }}
                    rehypeRewrite={(node, _, parent) => {
                      if (
                        node.type === 'element' &&
                        node.tagName === 'a' &&
                        parent?.type === 'element' &&
                        /^h[1-6]$/.test(parent.tagName)
                      ) {
                        parent.children = parent.children.slice(1);
                      }
                    }}
                  />
                </div>
              </>
            )}
          </div>
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>
    </div>
  );
};

export default Editor;
