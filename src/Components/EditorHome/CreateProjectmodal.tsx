import { useMutation } from '@apollo/client';
import { Modal, ModalContent, Button, Input } from '@nextui-org/react';
import { useState } from 'react';
import { CREATE_EDITOR } from '../../GraphQL/Mutations/Editor/Editor';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FiFolder, FiPlus, FiCode, FiX } from 'react-icons/fi';

const CreateProjectModal = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [projectName, setProjectName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [createEditor] = useMutation(CREATE_EDITOR, {
    onCompleted: data => {
      message.success('Project created successfully');
      setIsLoading(false);
      onOpenChange(false);
      setProjectName('');
      navigate(`/editor/${data.createEditor.id}`);
    },
    onError: err => {
      message.error(err.message);
      setIsLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!projectName.trim()) {
      message.warning('Please enter a project name');
      return;
    }
    setIsLoading(true);
    createEditor({ variables: { title: projectName } });
  };

  const handleClose = () => {
    setProjectName('');
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="sm"
      placement="center"
      backdrop="blur"
      classNames={{
        wrapper: 'z-[99999]',
        base: 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl',
        header: 'border-none px-0 py-0',
        body: 'px-0 py-0',
        closeButton: 'hidden',
      }}
      motionProps={{
        variants: {
          enter: {
            scale: 1,
            opacity: 1,
            transition: {
              duration: 0.25,
              ease: 'easeOut',
            },
          },
          exit: {
            scale: 0.95,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: 'easeIn',
            },
          },
        },
      }}
    >
      <ModalContent className="rounded-3xl overflow-hidden">
        {() => (
          <div className="relative">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
            >
              <FiX className="w-4 h-4 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200" />
            </button>

            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/20">
                  <FiCode className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    New Project
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Start building something amazing
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Input
                    value={projectName}
                    onChange={e => setProjectName(e.target.value)}
                    placeholder="My awesome project"
                    variant="bordered"
                    size="lg"
                    startContent={<FiFolder className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                    classNames={{
                      base: 'group',
                      mainWrapper: 'h-12',
                      input: [
                        'text-base',
                        'placeholder:text-gray-400',
                        'group-data-[focus=true]:placeholder:text-gray-300',
                      ],
                      inputWrapper: [
                        'h-12',
                        'border-gray-200 dark:border-gray-700',
                        'data-[hover=true]:border-gray-300 dark:data-[hover=true]:border-gray-600',
                        'group-data-[focus=true]:border-blue-500 dark:group-data-[focus=true]:border-blue-400',
                        'bg-gray-50/50 dark:bg-gray-800/50',
                        'backdrop-blur-sm',
                        'rounded-xl',
                        'shadow-sm',
                      ],
                    }}
                    autoFocus
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="ghost"
                    onPress={handleClose}
                    className="flex-1 h-11 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-medium"
                    isDisabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-11 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
                    startContent={!isLoading && <FiPlus className="w-4 h-4" />}
                    isLoading={isLoading}
                    spinner={
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    }
                  >
                    {isLoading ? 'Creating...' : 'Create'}
                  </Button>
                </div>
              </form>

              {/* Quick Tips */}
              <div className="mt-4 p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200/50 dark:border-blue-800/30">
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
                    <span className="font-medium">Pro tip:</span> Use descriptive names like
                    "chat-app" or "portfolio-site" to easily identify your projects later.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateProjectModal;
