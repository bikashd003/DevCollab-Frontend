import { useEffect } from 'react';
import MarkdownEditor from '@uiw/react-markdown-editor';
import { useTheme } from '../../Context/ThemeProvider';

interface MarkdownEditorProps {
  markdown: string;
  setMarkdown: React.Dispatch<React.SetStateAction<string>>;
  height?: string;
  placeholder?: string;
}

const Editor: React.FC<MarkdownEditorProps> = ({
  markdown,
  setMarkdown,
  height = '400px',
  placeholder = 'Write your content here...',
}: MarkdownEditorProps) => {
  const { theme } = useTheme();

  useEffect(() => {
    setMarkdown(markdown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markdown]);

  return (
    <div data-color-mode={theme === 'dark' ? 'dark' : 'light'}>
      <MarkdownEditor
        value={markdown}
        onChange={value => {
          setMarkdown(value);
        }}
        onFocus={() => {
          // Maintain focus on the editor
          document.getElementById('markdown-editor')?.focus();
        }}
        height={height}
        placeholder={placeholder}
        toolbars={['bold', 'italic', 'underline', 'header', 'code', 'olist', 'ulist']}
        toolbarsMode={['preview']}
        className="rounded-xl p-2 border-2 dark:border-gray-300 border-gray-700"
      />
    </div>
  );
};

export default Editor;
