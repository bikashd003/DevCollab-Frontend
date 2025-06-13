import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import type { ChainedCommands } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { FaRegEye, FaMarkdown, FaExpand, FaCompress } from 'react-icons/fa';
import { GrBlockQuote } from 'react-icons/gr';
import { MdOutlineFormatStrikethrough } from 'react-icons/md';
import { IoCodeSlashSharp, IoCodeWorkingOutline } from 'react-icons/io5';
import { MdFormatListBulleted } from 'react-icons/md';
import { RiListOrdered } from 'react-icons/ri';
import { useTheme } from '../../Context/ThemeProvider';
import { BiBold, BiItalic } from 'react-icons/bi';
import { motion } from 'framer-motion';

interface EditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
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
  <motion.button
    onClick={onClick}
    disabled={disabled}
    title={title}
    whileHover={{ scale: disabled ? 1 : 1.05 }}
    whileTap={{ scale: disabled ? 1 : 0.95 }}
    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    className={`
      relative p-2.5 rounded-xl transition-all duration-300 ease-out group
      ${
        isActive
          ? 'bg-theme-accent text-white shadow-lg shadow-theme-accent/25'
          : 'text-theme-secondary hover-theme-bg hover-theme-text'
      }
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md focus-theme-ring'}
      backdrop-blur-sm border border-theme-secondary/20
    `}
  >
    <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
    {isActive && (
      <motion.div
        layoutId="activeButton"
        className="absolute inset-0 rounded-xl bg-gradient-theme-primary opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        exit={{ opacity: 0 }}
      />
    )}
  </motion.button>
);

const MenuBar: React.FC<{
  editor: ReturnType<typeof useEditor>;
  isMarkdownMode: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}> = ({ editor, isMarkdownMode, textareaRef }) => {
  if (!editor) return null;

  const buttons: ButtonConfig[] = [
    { command: 'toggleBold', icon: BiBold, active: 'bold', markdown: '**', title: 'Bold (Ctrl+B)' },
    {
      command: 'toggleItalic',
      icon: BiItalic,
      active: 'italic',
      markdown: '_',
      title: 'Italic (Ctrl+I)',
    },
    {
      command: 'toggleStrike',
      icon: MdOutlineFormatStrikethrough,
      active: 'strike',
      markdown: '~~',
      title: 'Strikethrough',
    },
    {
      command: 'toggleCode',
      icon: IoCodeSlashSharp,
      active: 'code',
      markdown: '`',
      title: 'Inline Code',
    },
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
      title: 'Numbered List',
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
      title: 'Quote',
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
        newText = before + markdown + markdown + after;
        newCursorPos = start + markdown.length;
      } else {
        newText = before + markdown + selected + markdown + after;
        newCursorPos = end + 2 * markdown.length;
      }

      textarea.value = newText;
      textarea.selectionStart = newCursorPos;
      textarea.selectionEnd = newCursorPos;
      textarea.focus();

      const event = new Event('input', { bubbles: true });
      textarea.dispatchEvent(event);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center flex-wrap gap-2 p-3 glass-theme rounded-xl border border-theme-secondary/30"
    >
      <div className="flex items-center gap-1 mr-3 pr-3 border-r border-theme-secondary/30">
        {buttons.slice(0, 4).map(({ command, icon, active, markdown, title }) => (
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
      <div className="flex items-center gap-1">
        {buttons.slice(4).map(({ command, icon, active, markdown, title }) => (
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
    </motion.div>
  );
};

const Editor: React.FC<EditorProps> = ({
  initialContent = '',
  onChange,
  placeholder = 'Start writing your content...',
  minHeight = '300px',
  maxHeight = '600px',
}) => {
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const [markdownContent, setMarkdownContent] = useState(initialContent);
  const [showPreview, setShowPreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { theme } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

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
        class:
          'focus:outline-none prose dark:prose-invert max-w-none prose-emerald prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:text-emerald-600 dark:prose-code:text-emerald-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-blockquote:border-emerald-500 prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 min-h-full cursor-text whitespace-pre-wrap',
        style: 'min-height: 200px; white-space: pre-wrap;',
      },
    },
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

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' && isMarkdownMode && textareaRef.current) {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        // Ensure spaces are inserted correctly
        textarea.value = text.substring(0, start) + ' ' + text.substring(end);
        textarea.selectionStart = start + 1;
        textarea.selectionEnd = start + 1;
        e.preventDefault();

        // Trigger onChange event
        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            if (editor && !isMarkdownMode) {
              editor.chain().focus().toggleBold().run();
            }
            break;
          case 'i':
            e.preventDefault();
            if (editor && !isMarkdownMode) {
              editor.chain().focus().toggleItalic().run();
            }
            break;
          case 'Enter':
            e.preventDefault();
            toggleFullscreen();
            break;
        }
      }

      if (e.key === 'Escape' && isFullscreen) {
        e.preventDefault();
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editor, isMarkdownMode, isFullscreen, toggleFullscreen]);

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

  // Click handler for the editor container to focus the editor
  const handleEditorClick = useCallback(() => {
    if (editor && !isMarkdownMode) {
      editor.commands.focus();
    } else if (textareaRef.current && isMarkdownMode) {
      textareaRef.current.focus();
    }
  }, [editor, isMarkdownMode]);

  if (!editor) return null;

  return (
    <motion.div
      ref={editorContainerRef}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`surface-theme w-full shadow-xl overflow-hidden flex flex-col transition-all duration-500 ease-out ${
        isFullscreen
          ? 'fixed inset-4 z-50 max-h-none h-auto rounded-2xl shadow-2xl backdrop-blur-xl'
          : `max-h-[${maxHeight}] h-[${minHeight}] rounded-xl`
      }`}
      style={isFullscreen ? {} : { minHeight, maxHeight }}
    >
      <div className="w-full sticky top-0 py-3 px-4 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <MenuBar editor={editor} isMarkdownMode={isMarkdownMode} textareaRef={textareaRef} />
          <div className="flex items-center space-x-2">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
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
              <ToolbarButton
                onClick={toggleFullscreen}
                isActive={isFullscreen}
                icon={isFullscreen ? FaCompress : FaExpand}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden cursor-text" onClick={handleEditorClick}>
        {isMarkdownMode ? (
          <div className={`flex h-full ${showPreview ? 'divide-x divide-theme-secondary/30' : ''}`}>
            <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col`}>
              <textarea
                ref={textareaRef}
                className="flex-1 p-6 bg-transparent text-theme-primary placeholder-theme-muted border-0 focus:outline-none focus:ring-0 resize-none font-mono text-sm leading-relaxed whitespace-pre-wrap custom-scrollbar"
                placeholder={`${placeholder}\n\nTip: Use Markdown syntax like:\n# Heading\n**Bold** *Italic*\n- List item\n> Quote\n\`code\``}
                value={markdownContent}
                onChange={handleMarkdownChange}
                autoFocus
                style={{ whiteSpace: 'pre-wrap' }}
              />
            </div>
            {showPreview && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="w-1/2 overflow-auto bg-theme-secondary/50 custom-scrollbar"
              >
                <div className="p-6">
                  <MarkdownPreview
                    style={{
                      padding: 0,
                      backgroundColor: 'transparent',
                      color: 'inherit',
                    }}
                    className="prose prose-sm dark:prose-invert prose-emerald max-w-none prose-headings:text-theme-primary prose-p:text-theme-secondary prose-strong:text-theme-primary prose-code:text-theme-accent prose-code:bg-theme-muted/30 prose-pre:bg-theme-muted/30 prose-blockquote:border-theme-accent"
                    source={markdownContent || '*Start typing to see preview...*'}
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
              </motion.div>
            )}
          </div>
        ) : (
          <div className="h-full overflow-auto custom-scrollbar" onClick={handleEditorClick}>
            <div className="p-6 min-h-full">
              <EditorContent
                editor={editor}
                className="prose-editor-content min-h-full focus-within:outline-none"
                style={{ whiteSpace: 'pre-wrap' }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Editor;
