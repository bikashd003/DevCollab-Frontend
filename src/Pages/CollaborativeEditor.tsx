import { useEffect, useRef, useState } from 'react';
import { EditorState, StateEffect, StateField } from '@codemirror/state';
import type { ViewUpdate } from '@codemirror/view';
import { EditorView, Decoration, type DecorationSet, WidgetType, keymap } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { php } from '@codemirror/lang-php';
import { rust } from '@codemirror/lang-rust';
import { go } from '@codemirror/lang-go';
import { basicSetup } from 'codemirror';
import type { Socket } from 'socket.io-client';
import { debounce } from 'lodash';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';

import { oneDark } from '@codemirror/theme-one-dark';
import BackendApi from '../Constant/Api';
import { ChevronDown, ChevronUp, Download } from 'lucide-react';

interface CodeChange {
  from: number;
  to: number;
  insert: string;
}

interface CursorPosition {
  userId: string;
  username: string;
  position: number;
  color: string;
  selection?: {
    anchor: number;
    head: number;
  };
}

type Language = 'javascript' | 'python' | 'java' | 'cpp' | 'html' | 'css' | 'php' | 'rust' | 'go';

interface ExecutionResult {
  output: string;
  error: string | null;
  executionTime: number;
}

// Cursor widget for displaying remote cursors
class CursorWidget extends WidgetType {
  constructor(private cursor: CursorPosition) {
    super();
  }

  toDOM() {
    const cursor = document.createElement('span');
    cursor.className = 'remote-cursor';
    cursor.style.cssText = `
      position: absolute;
      width: 2px;
      height: 1.2em;
      background-color: ${this.cursor.color};
      border-radius: 1px;
      animation: blink 1s infinite;
      z-index: 10;
    `;

    const label = document.createElement('div');
    label.className = 'cursor-label';
    label.textContent = this.cursor.username;
    label.style.cssText = `
      position: absolute;
      top: -20px;
      left: 0;
      background-color: ${this.cursor.color};
      color: white;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 11px;
      white-space: nowrap;
      z-index: 11;
    `;

    cursor.appendChild(label);
    return cursor;
  }
}

// State effect for updating cursors
const setCursorsEffect = StateEffect.define<CursorPosition[]>();

// State field for managing cursors
const cursorsField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(cursors, tr) {
    cursors = cursors.map(tr.changes);
    for (const effect of tr.effects) {
      if (effect.is(setCursorsEffect)) {
        const decorations = effect.value.map(cursor =>
          Decoration.widget({
            widget: new CursorWidget(cursor),
            side: 1,
          }).range(cursor.position)
        );
        cursors = Decoration.set(decorations);
      }
    }
    return cursors;
  },
  provide: f => EditorView.decorations.from(f),
});

const languageExtensions = {
  javascript: javascript(),
  python: python(),
  java: java(),
  cpp: cpp(),
  html: html(),
  css: css(),
  php: php(),
  rust: rust(),
  go: go(),
};

const languageFileExtensions: Record<Language, string> = {
  javascript: 'js',
  python: 'py',
  java: 'java',
  cpp: 'cpp',
  html: 'html',
  css: 'css',
  php: 'php',
  rust: 'rs',
  go: 'go',
};

const CollaborativeEditor = ({
  projectId,
  userId,
  socket,
  username,
}: {
  projectId: string | undefined;
  userId: string | null;
  socket: Socket;
  username: string;
}) => {
  const editorRef = useRef<EditorView | null>(null);
  const isRemoteChange = useRef(false);
  // ... your other useState/useRef declarations ...

  // Debounced emit functions defined with useRef so they are stable and always reference current props/refs
  const debouncedEmitChanges = useRef(
    debounce(() => {
      if (!isRemoteChange.current && socket && editorRef.current) {
        const code = editorRef.current.state.doc.toString();
        socket.emit('codeChange', {
          projectId,
          userId,
          changes: [{ from: 0, to: code.length, insert: code }],
        });
      }
    }, 200)
  ).current;

  const [language, setLanguage] = useState<Language>('javascript');
  const [output, setOutput] = useState<ExecutionResult>({
    output: '',
    error: null,
    executionTime: 0,
  });
  const [isExecuting, setIsExecuting] = useState(false);
  const [remoteCursors, setRemoteCursors] = useState<CursorPosition[]>([]);
  const [userColors] = useState<Map<string, string>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [_connectedUsers, setConnectedUsers] = useState<
    Array<{ id: string; username: string; color: string }>
  >([]);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'output'>('output');

  // Toggle panel with Ctrl+` (or Cmd+` on macOS)
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        setIsPanelOpen(prev => !prev);
        setActiveTab('output');
      }
    };
    document.addEventListener('keydown', handleGlobalKey);
    return () => document.removeEventListener('keydown', handleGlobalKey);
  }, []);

  // Generate a consistent color for each user
  const getUserColor = (userId: string): string => {
    if (!userColors.has(userId)) {
      const colors = [
        '#FF6B6B',
        '#4ECDC4',
        '#45B7D1',
        '#96CEB4',
        '#FFEAA7',
        '#DDA0DD',
        '#98D8C8',
        '#F7DC6F',
        '#BB8FCE',
        '#85C1E9',
        '#FF9F43',
        '#26de81',
        '#45aaf2',
        '#a55eea',
        '#fd9644',
        '#2d98da',
        '#26de81',
        '#fc5c65',
        '#45aaf2',
        '#a55eea',
      ];
      const colorIndex =
        userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
      userColors.set(userId, colors[colorIndex]);
    }
    return userColors.get(userId)!;
  };

  const handleDownloadCode = () => {
    if (!editorRef.current) return;

    const code = editorRef.current.state.doc.toString();
    const extension = languageFileExtensions[language];
    const filename = `code.${extension}`;

    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const executeCode = async () => {
    if (!editorRef.current || !isConnected) return;

    const code = editorRef.current.state.doc.toString();
    setIsExecuting(true);

    try {
      const startTime = performance.now();
      const response = await fetch(`${BackendApi}/api/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });

      const result = await response.json();
      const endTime = performance.now();
      const outputResult: ExecutionResult = {
        output: result.output || '',
        error: result.error || null,
        executionTime: endTime - startTime,
      };
      setOutput(outputResult);
      // Emit outputChanged to backend for collaboration
      if (socket && projectId) {
        socket.emit('outputChanged', { projectId, output: outputResult });
      }
    } catch (error) {
      const failResult: ExecutionResult = {
        output: '',
        error: 'Failed to execute code. Please try again.',
        executionTime: 0,
      };
      setOutput(failResult);
      if (socket && projectId) {
        socket.emit('outputChanged', { projectId, output: failResult });
      }
    } finally {
      setIsExecuting(false);
    }
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    // Update CodeMirror extension
    if (editorRef.current) {
      const view = editorRef.current;
      view.dispatch({
        effects: StateEffect.reconfigure.of([
          basicSetup,
          languageExtensions[newLanguage],
          EditorView.theme({
            '.remote-cursor': {
              position: 'relative',
              display: 'inline-block',
            },
            '.cursor-label': {
              fontSize: '11px',
              fontFamily: 'system-ui, sans-serif',
            },
            '@keyframes blink': {
              '0%, 50%': { opacity: '1' },
              '51%, 100%': { opacity: '0' },
            },
          }),
        ]),
      });
    }
    // Notify other users about language change
    socket.emit('languageChanged', { projectId, userId, language: newLanguage });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Add Ctrl+Enter or Cmd+Enter to execute code
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      executeCode();
    }
  };

  const debouncedEmitCursor = useRef(
    debounce((position: number) => {
      if (socket && userId) {
        socket.emit('cursorMove', {
          projectId,
          userId,
          username,
          position,
          color: getUserColor(userId),
        });
      }
    }, 50)
  ).current;

  useEffect(() => {
    // Create editor instance
    const state = EditorState.create({
      doc: '',
      extensions: [
        basicSetup,
        languageExtensions[language],
        cursorsField,
        oneDark,
        keymap.of([...defaultKeymap, indentWithTab]),
        EditorView.updateListener.of((update: ViewUpdate) => {
          if (update.docChanged && !isRemoteChange.current) {
            debouncedEmitChanges();
          }

          // Track cursor position changes
          if (update.selectionSet && !isRemoteChange.current) {
            const cursorPos = update.state.selection.main.head;
            debouncedEmitCursor(cursorPos);
          }
        }),
        EditorView.theme({
          '.remote-cursor': {
            position: 'relative',
            display: 'inline-block',
          },
          '.cursor-label': {
            fontSize: '11px',
            fontFamily: 'system-ui, sans-serif',
          },
          '@keyframes blink': {
            '0%, 50%': { opacity: '1' },
            '51%, 100%': { opacity: '0' },
          },
        }),
      ],
    });

    editorRef.current = new EditorView({
      state,
      parent: document.getElementById('editor-container')!,
    });

    // Request initial code and language
    socket.emit('requestInitialCode', projectId);

    // Socket event listeners
    socket.on(
      'initialCode',
      (data: { code: string; language: Language; lastOutput?: ExecutionResult }) => {
        if (editorRef.current) {
          const transaction = editorRef.current.state.update({
            changes: { from: 0, to: editorRef.current.state.doc.length, insert: data.code },
          });
          editorRef.current.dispatch(transaction);
        }
        // Set language and update extension
        setLanguage(data.language);
        // Set output if present
        if (data.lastOutput) setOutput(data.lastOutput);
      }
    );

    socket.on('codeChange', (data: { userId: string; changes: CodeChange[] }) => {
      if (data.userId === userId) return;
      if (editorRef.current && data.changes && data.changes.length > 0) {
        isRemoteChange.current = true;
        // Always replace the full content for real-time sync
        const transaction = editorRef.current.state.update({
          changes: {
            from: 0,
            to: editorRef.current.state.doc.length,
            insert: data.changes[0].insert,
          },
        });
        editorRef.current.dispatch(transaction);
        isRemoteChange.current = false;
      }
    });

    socket.on('outputChanged', (result: ExecutionResult) => {
      setOutput(result);
    });

    return () => {
      socket.off('initialCode');
      socket.off('codeChange');
      socket.off('outputChanged');
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, userId, socket, debouncedEmitChanges, debouncedEmitCursor]);

  useEffect(() => {
    // Socket event listeners
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    const handleUserJoined = (user: { id: string; username: string; color: string }) => {
      setConnectedUsers((prev: Array<{ id: string; username: string; color: string }>) => [
        ...prev,
        user,
      ]);
    };
    const handleUserLeft = (leftUserId: string) => {
      setConnectedUsers((prev: Array<{ id: string; username: string; color: string }>) =>
        prev.filter(u => u.id !== leftUserId)
      );
      setRemoteCursors(prev => prev.filter(c => c.userId !== leftUserId));
    };
    const handleCursorMove = (cursor: CursorPosition) => {
      if (cursor.userId === userId) return;

      setRemoteCursors(prev => {
        const existing = prev.findIndex(c => c.userId === cursor.userId);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = cursor;
          return updated;
        }
        return [...prev, cursor];
      });

      // Update cursor decorations
      if (editorRef.current) {
        const effects: StateEffect<unknown>[] = [];
        effects.push(setCursorsEffect.of([...remoteCursors, cursor]));
        editorRef.current.dispatch({ effects });
      }
    };
    const handleLanguageChanged = (data: { userId: string; language: Language }) => {
      if (data.userId === userId) return;
      setLanguage(data.language);
      // Update CodeMirror extension
      if (editorRef.current) {
        const view = editorRef.current;
        view.dispatch({
          effects: StateEffect.reconfigure.of([
            basicSetup,
            languageExtensions[data.language],
            cursorsField,
            oneDark,
            keymap.of([...defaultKeymap, indentWithTab]),
            EditorView.updateListener.of((update: ViewUpdate) => {
              if (update.docChanged && !isRemoteChange.current) {
                debouncedEmitChanges();
              }
              if (update.selectionSet && !isRemoteChange.current) {
                const cursorPos = update.state.selection.main.head;
                debouncedEmitCursor(cursorPos);
              }
            }),
            EditorView.theme({
              '.remote-cursor': {
                position: 'relative',
                display: 'inline-block',
              },
              '.cursor-label': {
                fontSize: '11px',
                fontFamily: 'system-ui, sans-serif',
              },
              '@keyframes blink': {
                '0%, 50%': { opacity: '1' },
                '51%, 100%': { opacity: '0' },
              },
            }),
          ]),
        });
      }
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('userJoined', handleUserJoined);
    socket.on('userLeft', handleUserLeft);
    socket.on('cursorMove', handleCursorMove);
    socket.on('languageChanged', handleLanguageChanged);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
      socket.off('cursorMove', handleCursorMove);
      socket.off('languageChanged', handleLanguageChanged);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, userId, remoteCursors]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Language:</span>
            <select
              value={language}
              onChange={e => handleLanguageChange(e.target.value as Language)}
              className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
            >
              {Object.keys(languageExtensions).map(lang => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
            <button
              onClick={handleDownloadCode}
              title="Download Code"
              className="ml-2 p-1.5 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            >
              <Download size={16} />
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={executeCode}
            disabled={isExecuting || !isConnected}
            className={`px-4 py-1 rounded text-sm font-medium ${
              isExecuting || !isConnected
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isExecuting ? 'Executing...' : 'Run (Ctrl+Enter)'}
          </button>
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
            />
            <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
        {/* Editor Pane */}
        <div style={{ flex: 1, minHeight: '200px', overflow: 'hidden' }}>
          <div
            id="editor-container"
            style={{ height: '100%', width: '100%', overflow: 'auto' }}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Resizable Splitter Handle */}
        <div
          style={{
            height: '4px',
            background: '#212121',
            cursor: 'row-resize',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseDown={e => {
            e.preventDefault();
            const startY = e.clientY;
            const startHeight = document.getElementById('output-panel')?.offsetHeight || 200;

            const onMouseMove = (e: MouseEvent) => {
              const newHeight = startHeight + (startY - e.clientY);
              const panel = document.getElementById('output-panel');
              if (panel) {
                panel.style.height = `${Math.max(200, newHeight)}px`;
              }
            };

            const onMouseUp = () => {
              document.removeEventListener('mousemove', onMouseMove);
              document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
          }}
        >
          <div style={{ width: '40px', height: '2px', background: '#666' }} />
        </div>

        {/* Output Panel */}
        <div
          id="output-panel"
          style={{
            height: '30%',
            minHeight: '200px',
            maxHeight: '70%',
            display: isPanelOpen ? 'flex' : 'none',
            flexDirection: 'column',
            background: '#212121',
            borderTop: '1px solid #303030',
          }}
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700 text-sm select-none">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab('output')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeTab === 'output'
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Output
              </button>
            </div>
            <button
              onClick={() => setIsPanelOpen(false)}
              className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
              title="Minimize Panel"
            >
              <ChevronDown size={16} />
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-auto font-mono text-sm p-4">
            {activeTab === 'output' ? (
              <>
                {output.error ? (
                  <div className="text-red-400">{output.error}</div>
                ) : (
                  <div className="whitespace-pre-wrap">
                    {output.output || 'No output yet. Run your code to see results.'}
                  </div>
                )}
                {output.executionTime > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    Execution time: {output.executionTime.toFixed(2)}ms
                  </div>
                )}
              </>
            ) : (
              <div className="text-gray-400 italic">Interactive terminal coming soon...</div>
            )}
          </div>
        </div>
      </div>
      {!isPanelOpen && (
        <button
          onClick={() => setIsPanelOpen(true)}
          className="absolute bottom-2 right-2 bg-gray-800/60 hover:bg-gray-700 text-gray-200 rounded-full p-2 backdrop-blur-md z-10"
          title="Show Output Panel"
        >
          <ChevronUp size={16} />
        </button>
      )}
    </div>
  );
};

export default CollaborativeEditor;
