import { useEffect, useRef, useState } from 'react';
import { EditorState, StateEffect } from '@codemirror/state';
import type { ViewUpdate } from '@codemirror/view';
import { EditorView, keymap } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { basicSetup } from 'codemirror';
import type { Socket } from 'socket.io-client';
import { debounce } from 'lodash';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';

import { oneDark } from '@codemirror/theme-one-dark';
import BackendApi from '../Constant/Api';
import { ChevronDown, ChevronUp, Download, Wifi, WifiOff } from 'lucide-react';
import { Button } from 'antd';

interface CodeChange {
  from: number;
  to: number;
  insert: string;
}

type Language = 'javascript' | 'python' | 'java' | 'cpp';

interface ExecutionResult {
  output: string;
  error: string | null;
  executionTime: number;
}

const languageExtensions = {
  javascript: javascript(),
  python: python(),
  java: java(),
  cpp: cpp(),
};

const languageFileExtensions: Record<Language, string> = {
  javascript: 'js',
  python: 'py',
  java: 'java',
  cpp: 'cpp',
};

const CollaborativeEditor = ({
  projectId,
  userId,
  socket,
}: {
  projectId: string | undefined;
  userId: string | null;
  socket: Socket;
  username: string;
}) => {
  const editorRef = useRef<EditorView | null>(null);
  const isRemoteChange = useRef(false);

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
        effects: StateEffect.reconfigure.of([basicSetup, languageExtensions[newLanguage]]),
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

  useEffect(() => {
    // Create editor instance
    const state = EditorState.create({
      doc: '',
      extensions: [
        basicSetup,
        languageExtensions[language],
        oneDark,
        keymap.of([...defaultKeymap, indentWithTab]),
        EditorView.updateListener.of((update: ViewUpdate) => {
          if (update.docChanged && !isRemoteChange.current) {
            debouncedEmitChanges();
          }
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
  }, [projectId, userId, socket, debouncedEmitChanges]);

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
    };

    const handleLanguageChanged = (data: { userId: string; language: Language }) => {
      if (data.userId !== userId) {
        setLanguage(data.language);
        if (editorRef.current) {
          const view = editorRef.current;
          view.dispatch({
            effects: StateEffect.reconfigure.of([
              basicSetup,
              languageExtensions[data.language],
              oneDark,
              keymap.of([...defaultKeymap, indentWithTab]),
              EditorView.updateListener.of((update: ViewUpdate) => {
                if (update.docChanged && !isRemoteChange.current) {
                  debouncedEmitChanges();
                }
              }),
            ]),
          });
        }
      }
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('userJoined', handleUserJoined);
    socket.on('userLeft', handleUserLeft);
    socket.on('languageChanged', handleLanguageChanged);

    socket.emit('joinProject', { projectId, userId });

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('userJoined', handleUserJoined);
      socket.off('userLeft', handleUserLeft);
      socket.off('languageChanged', handleLanguageChanged);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, userId, socket]);

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <select
            value={language}
            onChange={e => handleLanguageChange(e.target.value as Language)}
            className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>

          <button
            onClick={executeCode}
            disabled={isExecuting || !isConnected}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-1 rounded"
          >
            {isExecuting ? 'Running...' : 'Run'}
          </button>

          <Button
            onClick={handleDownloadCode}
            type="text"
            className="text-blue-400"
            icon={<Download size={16} />}
          />
        </div>

        <div className="flex items-center space-x-2">
          {isConnected ? (
            <Wifi className="w-4 h-4 text-emerald-400" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-400" />
          )}
          <span className="text-sm text-gray-300">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1" onKeyDown={handleKeyDown}>
          <div id="editor-container" className="h-full" />
        </div>

        <div
          className={`bg-gray-800 border-t border-gray-700 transition-all duration-200 ${isPanelOpen ? 'h-64' : 'h-8'}`}
        >
          <div className="flex items-center justify-between px-4 py-2 bg-gray-700">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('output')}
                className={`text-sm px-2 py-1 rounded ${activeTab === 'output' ? 'bg-gray-600 text-white' : 'text-gray-300'}`}
              >
                Output
              </button>
            </div>
            <button
              onClick={() => setIsPanelOpen(!isPanelOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isPanelOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>

          {isPanelOpen && (
            <div className="p-4 h-full overflow-auto">
              {activeTab === 'output' && (
                <div className="space-y-2">
                  {output.error ? (
                    <div className="text-red-400 font-mono text-sm whitespace-pre-wrap">
                      {output.error}
                    </div>
                  ) : (
                    <div className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                      {output.output || 'No output'}
                    </div>
                  )}
                  {output.executionTime > 0 && (
                    <div className="text-gray-400 text-xs">
                      Execution time: {output.executionTime.toFixed(2)}ms
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollaborativeEditor;
