import React from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { useTheme } from '../../Context/ThemeProvider';

interface MarkdownPreviewComponentProps {
  content: string;
}

const MarkdownPreviewComponent: React.FC<MarkdownPreviewComponentProps> = ({ content }) => {
  const { theme } = useTheme();

  return (
    <MarkdownPreview
      style={{ padding: 16, backgroundColor: 'transparent' }}
      className="dark:bg-transparent text-foreground"
      source={content}
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
  );
};

export default MarkdownPreviewComponent;
