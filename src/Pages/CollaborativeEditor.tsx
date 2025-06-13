// src/components/CollaborativeEditor.tsx
import { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import type { ViewUpdate } from '@codemirror/view';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { basicSetup } from 'codemirror';
import type { Socket } from 'socket.io-client';
import { debounce } from 'lodash';

// Add types for your changes
interface CodeChange {
  from: number;
  to: number;
  insert: string;
}

const CollaborativeEditor = ({
  projectId,
  userId,
  socket,
}: {
  projectId: string | undefined;
  userId: string | null;
  socket: Socket;
}) => {
  const editorRef = useRef<EditorView | null>(null);
  const isRemoteChange = useRef(false);

  useEffect(() => {
    // Create editor instance
    const state = EditorState.create({
      doc: '',
      extensions: [
        basicSetup,
        javascript(),
        EditorView.updateListener.of((update: ViewUpdate) => {
          if (update.docChanged && !isRemoteChange.current) {
            const changes = update.changes.toJSON();
            debouncedEmitChanges(changes);
          }
        }),
        // Add your theme extension here
        // theme === 'dark' ? oneDark : []
      ],
    });

    editorRef.current = new EditorView({
      state,
      parent: document.getElementById('editor-container')!,
    });

    // Request initial code
    socket.emit('requestInitialCode', projectId);

    // Socket event listeners
    socket.on('initialCode', (initialCode: string) => {
      if (editorRef.current) {
        const transaction = editorRef.current.state.update({
          changes: { from: 0, to: editorRef.current.state.doc.length, insert: initialCode },
        });
        editorRef.current.dispatch(transaction);
      }
    });

    socket.on('codeChange', (data: { userId: string; changes: CodeChange[] }) => {
      if (data.userId === userId) return;

      if (editorRef.current) {
        isRemoteChange.current = true;
        const transaction = editorRef.current.state.update({
          changes: data.changes,
        });
        editorRef.current.dispatch(transaction);
        isRemoteChange.current = false;
      }
    });

    return () => {
      socket.off('initialCode');
      socket.off('codeChange');
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, userId, socket]);

  const debouncedEmitChanges = debounce((changes: CodeChange[]) => {
    if (!isRemoteChange.current && socket) {
      socket.emit('codeChange', {
        projectId,
        userId,
        changes,
      });
    }
  }, 200);

  return <div id="editor-container" className="h-full w-full" />;
};

export default CollaborativeEditor;
