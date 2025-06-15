import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useEditor, EditorContent, type Editor as TiptapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import MarkdownPreview from '@uiw/react-markdown-preview';

// Using Lucide React icons
import {
  Eye,
  FileText,
  Maximize,
  Minimize,
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Terminal,
  Quote,
  type LucideProps,
} from 'lucide-react';

interface EditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  className?: string;
  theme?: 'light' | 'dark';
}

interface ButtonConfig {
  command: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  active: string;
  markdown: string;
  title: string;
}

interface ToolbarButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isActive: boolean;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  disabled?: boolean;
  title?: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = React.memo(
  ({ onClick, isActive, icon: Icon, disabled = false, title = '' }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
      relative p-1.5 rounded-md transition-all duration-150 ease-out
      ${
        isActive
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800'
      }
      ${
        disabled
          ? 'opacity-40 cursor-not-allowed'
          : 'hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
      }
    `}
    >
      <Icon size={14} className="transition-transform duration-150" />
    </button>
  )
);

ToolbarButton.displayName = 'ToolbarButton';

interface MenuBarProps {
  editor: TiptapEditor | null;
  isMarkdownMode: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

const MenuBar: React.FC<MenuBarProps> = React.memo(({ editor, isMarkdownMode, textareaRef }) => {
  const buttons: ButtonConfig[] = useMemo(
    () => [
      { command: 'toggleBold', icon: Bold, active: 'bold', markdown: '**', title: 'Bold (Ctrl+B)' },
      {
        command: 'toggleItalic',
        icon: Italic,
        active: 'italic',
        markdown: '_',
        title: 'Italic (Ctrl+I)',
      },
      {
        command: 'toggleStrike',
        icon: Strikethrough,
        active: 'strike',
        markdown: '~~',
        title: 'Strikethrough',
      },
      { command: 'toggleCode', icon: Code, active: 'code', markdown: '`', title: 'Inline Code' },
      {
        command: 'toggleBulletList',
        icon: List,
        active: 'bulletList',
        markdown: '- ',
        title: 'Bullet List',
      },
      {
        command: 'toggleOrderedList',
        icon: ListOrdered,
        active: 'orderedList',
        markdown: '1. ',
        title: 'Numbered List',
      },
      {
        command: 'toggleCodeBlock',
        icon: Terminal,
        active: 'codeBlock',
        markdown: '```\n',
        title: 'Code Block',
      },
      {
        command: 'toggleBlockquote',
        icon: Quote,
        active: 'blockquote',
        markdown: '> ',
        title: 'Quote',
      },
    ],
    []
  );

  const insertMarkdown = useCallback(
    (markdown: string) => {
      if (!textareaRef.current) return;

      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const selected = text.substring(start, end);
      const after = text.substring(end);

      let newText: string;
      let newCursorPos: number;

      if (start === end) {
        if (markdown.includes('\n')) {
          newText = before + markdown + after;
          newCursorPos = start + markdown.length - 1;
        } else {
          newText = before + markdown + markdown + after;
          newCursorPos = start + markdown.length;
        }
      } else {
        newText = before + markdown + selected + markdown + after;
        newCursorPos = end + markdown.length * 2;
      }

      textarea.value = newText;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();

      const event = new Event('input', { bubbles: true });
      textarea.dispatchEvent(event);
    },
    [textareaRef]
  );

  const handleButtonClick = useCallback(
    (command: string, markdown: string) => {
      return (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (isMarkdownMode) {
          insertMarkdown(markdown);
        } else if (editor) {
          const chain = editor.chain().focus();
          const commandMethod = (chain as Record<string, unknown>)[command];
          if (typeof commandMethod === 'function') {
            (commandMethod as () => { run: () => void })().run();
          }
        }
      };
    },
    [editor, isMarkdownMode, insertMarkdown]
  );

  if (!editor) return null;

  return (
    <div className="flex items-center gap-0.5 px-2 py-1.5 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/60 dark:border-gray-700/60">
      <div className="flex items-center gap-0.5 mr-1.5 pr-1.5 border-r border-gray-300/50 dark:border-gray-600/50">
        {buttons.slice(0, 4).map(({ command, icon, active, markdown, title }) => (
          <ToolbarButton
            key={command}
            onClick={handleButtonClick(command, markdown)}
            isActive={!isMarkdownMode && editor.isActive(active)}
            icon={icon}
            title={title}
          />
        ))}
      </div>
      <div className="flex items-center gap-0.5">
        {buttons.slice(4).map(({ command, icon, active, markdown, title }) => (
          <ToolbarButton
            key={command}
            onClick={handleButtonClick(command, markdown)}
            isActive={!isMarkdownMode && editor.isActive(active)}
            icon={icon}
            title={title}
          />
        ))}
      </div>
    </div>
  );
});

MenuBar.displayName = 'MenuBar';

const Editor: React.FC<EditorProps> = ({
  initialContent = '',
  onChange,
  placeholder = 'Start writing your content...',
  minHeight = '400px',
  maxHeight = '600px',
  className = '',
  theme = 'light',
}) => {
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const [markdownContent, setMarkdownContent] = useState(initialContent);
  const [showPreview, setShowPreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
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
          'focus:outline-none prose dark:prose-invert max-w-none prose-emerald prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:text-emerald-600 dark:prose-code:text-emerald-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-blockquote:border-emerald-500 prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 cursor-text overflow-auto',
      },
    },
    enableInputRules: true,
    enablePasteRules: true,
  });

  useEffect(() => {
    if (editor && !isMarkdownMode && initialContent !== markdownContent) {
      editor.commands.setContent(initialContent || '<p></p>');
    }
  }, [editor, initialContent, isMarkdownMode, markdownContent]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
            setIsFullscreen(prev => !prev);
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
  }, [editor, isMarkdownMode, isFullscreen]);

  const togglePreview = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPreview(prev => !prev);
  }, []);

  const toggleMarkdownMode = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (editor) {
        if (isMarkdownMode) {
          editor.commands.setContent(markdownContent);
        } else {
          const markdown = editor.storage.markdown.getMarkdown();
          setMarkdownContent(markdown);
        }
      }

      setIsMarkdownMode(prev => !prev);
      setShowPreview(false);
    },
    [editor, isMarkdownMode, markdownContent]
  );

  const toggleFullscreen = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFullscreen(prev => !prev);
  }, []);

  const handleMarkdownChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = e.target.value;
      setMarkdownContent(newContent);
      onChange?.(newContent);
    },
    [onChange]
  );

  const handleEditorClick = useCallback(() => {
    if (editor && !isMarkdownMode) {
      editor.commands.focus();
    } else if (textareaRef.current && isMarkdownMode) {
      textareaRef.current.focus();
    }
  }, [editor, isMarkdownMode]);

  if (!editor) return null;

  const containerStyles: React.CSSProperties = isFullscreen
    ? {
        position: 'fixed',
        inset: '1rem',
        zIndex: 50,
        maxHeight: 'calc(100vh - 2rem)',
        height: 'calc(100vh - 2rem)',
      }
    : {
        minHeight,
        maxHeight,
        height: maxHeight,
      };

  return (
    <div
      ref={editorContainerRef}
      className={`
        w-full bg-white dark:bg-gray-900 shadow-lg overflow-hidden flex flex-col 
        transition-all duration-300 ease-out border border-gray-200/60 dark:border-gray-700/60
        ${isFullscreen ? 'rounded-xl shadow-2xl' : 'rounded-xl'} 
        ${className}
      `}
      style={containerStyles}
    >
      {/* Header with compact toolbar */}
      <div className="flex-shrink-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200/60 dark:border-gray-700/60 px-4 py-2">
        <div className="flex justify-between items-center">
          <MenuBar editor={editor} isMarkdownMode={isMarkdownMode} textareaRef={textareaRef} />

          <div className="flex items-center gap-0.5 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-1 py-1 border border-gray-200/60 dark:border-gray-700/60">
            <ToolbarButton
              onClick={toggleMarkdownMode}
              isActive={isMarkdownMode}
              icon={FileText}
              title="Markdown Mode"
            />
            <ToolbarButton
              onClick={togglePreview}
              isActive={showPreview}
              icon={Eye}
              title="Live Preview"
              disabled={!isMarkdownMode}
            />
            <ToolbarButton
              onClick={toggleFullscreen}
              isActive={isFullscreen}
              icon={isFullscreen ? Minimize : Maximize}
              title={isFullscreen ? 'Exit Fullscreen (Ctrl+Enter)' : 'Fullscreen (Ctrl+Enter)'}
            />
          </div>
        </div>
      </div>

      {/* Content area with proper scrolling */}
      <div className="flex-1 overflow-hidden min-h-0" onClick={handleEditorClick}>
        {isMarkdownMode ? (
          <div
            className={`flex h-full ${showPreview ? 'divide-x divide-gray-200 dark:divide-gray-700' : ''}`}
          >
            <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col min-h-0`}>
              <textarea
                ref={textareaRef}
                className="
                  flex-1 p-4 bg-transparent text-gray-900 dark:text-gray-100
                  placeholder-gray-500 dark:placeholder-gray-400 border-0 focus:outline-none
                  resize-none font-mono text-sm leading-relaxed overflow-y-auto
                  scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600
                  scrollbar-track-transparent hover:scrollbar-thumb-gray-400
                  dark:hover:scrollbar-thumb-gray-500
                "
                placeholder={`${placeholder}\n\nTip: Use Markdown syntax like:\n# Heading\n**Bold** *Italic*\n- List item\n> Quote\n\`code\``}
                value={markdownContent}
                onChange={handleMarkdownChange}
                style={{
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                }}
              />
            </div>

            {showPreview && (
              <div className="w-1/2 overflow-y-auto bg-gray-50/50 dark:bg-gray-800/50 min-h-0 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                <div className="p-4">
                  <MarkdownPreview
                    style={{
                      padding: 0,
                      backgroundColor: 'transparent',
                      color: 'inherit',
                    }}
                    className="prose prose-sm dark:prose-invert prose-emerald max-w-none"
                    source={markdownContent || '*Start typing to see preview...*'}
                    wrapperElement={{
                      'data-color-mode': theme,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
            <div className="p-4 min-h-full">
              <EditorContent
                editor={editor}
                className="min-h-full focus-within:outline-none"
                style={{
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
