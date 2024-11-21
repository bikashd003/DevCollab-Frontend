import { useMutation } from '@apollo/client';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@nextui-org/react';
import { useState } from 'react';
import { CREATE_EDITOR } from '../../GraphQL/Mutations/Editor/Editor';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const CreateProjectModal = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [projectName, setProjectName] = useState('');
  const navigate = useNavigate();
  const [createEditor] = useMutation(CREATE_EDITOR, {
    onCompleted: data => {
      message.success('Project created successfully');
      onOpenChange(false);
      navigate(`/editor/${data.createEditor.id}`);
    },
    onError: err => {
      message.error(err.message);
    },
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createEditor({ variables: { title: projectName } });
  };
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create New Project</ModalHeader>
              <ModalBody>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      value={projectName}
                      onChange={e => setProjectName(e.target.value)}
                      placeholder="Enter project name"
                      className="w-full p-2 border rounded"
                    />
                    <button
                      type="submit"
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded float-end"
                    >
                      Create Project
                    </button>
                  </form>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateProjectModal;
