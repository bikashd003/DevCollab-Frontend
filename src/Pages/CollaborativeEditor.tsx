import { useEffect, useRef } from 'react';
import type { OnMount } from '@monaco-editor/react';
import Editor from '@monaco-editor/react';
import type { Socket } from 'socket.io-client';
import io from 'socket.io-client';
import * as monaco from 'monaco-editor';
import { useTheme } from '../Context/ThemeProvider';
import { debounce } from 'lodash';
import BackendApi from '../Constant/Api';
interface CodeChangeData {
  range: monaco.IRange;
  text: string;
}

function CollaborativeEditor() {
  const { theme } = useTheme();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Initialize socket and register the completion provider
  useEffect(() => {
    socketRef.current = io(BackendApi);

    socketRef.current.on('codeChange', (data: CodeChangeData) => {
      if (editorRef.current) {
        const model = editorRef.current.getModel();
        if (model) {
          model.applyEdits([{ range: data.range, text: data.text }]);
        }
      }
    });

    // Register JavaScript auto-completion provider
    monaco.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: (_model, position) => {
        const suggestions: monaco.languages.CompletionItem[] = [
          {
            label: 'console.log',
            kind: monaco.languages.CompletionItemKind.Function,
            range: {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: position.column,
              endColumn: position.column,
            },
            documentation: 'Log output to console',
            insertText: 'console.log(${1:object});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          },
          {
            label: 'setTimeout',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Executes a function after a delay',
            insertText: 'setTimeout(() => {\n\t${1}\n}, ${2:1000});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: position.column,
              endColumn: position.column,
            },
          },
        ];
        return { suggestions };
      },
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Handle editor mount and set up listeners
  const handleEditorDidMount: OnMount = editor => {
    editorRef.current = editor;

    const debouncedEmitChange = debounce((changes: monaco.editor.IModelContentChange[]) => {
      changes.forEach(change => {
        if (socketRef.current) {
          socketRef.current.emit('codeChange', {
            range: change.range,
            text: change.text,
          });
        }
      });
    }, 200);

    // Emit content changes to the server
    editor.onDidChangeModelContent(event => {
      debouncedEmitChange(event.changes);
    });

    // Emit cursor position changes to the server
    editor.onDidChangeCursorPosition(() => {
      const cursorPosition = editor.getPosition();
      if (socketRef.current && cursorPosition) {
        socketRef.current.emit('cursorPosition', {
          line: cursorPosition.lineNumber,
          column: cursorPosition.column,
        });
      }
    });

    // Set editor options
    editor.updateOptions({
      autoClosingBrackets: 'always',
      autoClosingQuotes: 'always',
      autoIndent: 'full',
      wordWrap: 'on',
      smoothScrolling: true,
      scrollBeyondLastLine: false,
    });
  };

  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      defaultValue="// Start collaborative coding here"
      onMount={handleEditorDidMount}
      theme={theme === 'dark' ? 'vs-dark' : 'light'}
      options={{
        wordWrap: 'on',
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        tabSize: 2,
        scrollBeyondLastLine: false,
        smoothScrolling: true,
      }}
    />
  );
}

export default CollaborativeEditor;
