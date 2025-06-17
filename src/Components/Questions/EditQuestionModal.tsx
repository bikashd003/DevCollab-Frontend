import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from '@nextui-org/react';
import { Edit3, Plus, X, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '../Global/Editor';

interface EditQuestionModalProps {
  editQuestionModal: boolean;
  setEditQuestionModal: (open: boolean) => void;
  editQuestionData: {
    title: string;
    content: string;
    tags: string[];
  };
  setEditQuestionData: React.Dispatch<
    React.SetStateAction<{
      title: string;
      content: string;
      tags: string[];
    }>
  >;
  handleUpdateQuestion: () => Promise<void>;
}

const EditQuestionModal: React.FC<EditQuestionModalProps> = ({
  editQuestionModal,
  setEditQuestionModal,
  editQuestionData,
  setEditQuestionData,
  handleUpdateQuestion,
}) => {
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTag = () => {
    if (newTag.trim() && !editQuestionData.tags.includes(newTag.trim())) {
      setEditQuestionData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditQuestionData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await handleUpdateQuestion();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={editQuestionModal}
      onOpenChange={setEditQuestionModal}
      size="4xl"
      scrollBehavior="inside"
      backdrop="blur"
      classNames={{
        base: 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50',
        header:
          'border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20',
        body: 'py-4 px-6',
        footer:
          'border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50',
      }}
    >
      <ModalContent className="max-h-[90vh]">
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1 pb-4">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Edit Question
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Update your question details and content
                  </p>
                </div>
              </motion.div>
            </ModalHeader>

            <ModalBody className="overflow-y-auto">
              <div className="space-y-5">
                {/* Title Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Question Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={editQuestionData.title}
                    onChange={e =>
                      setEditQuestionData(prev => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Enter a clear, descriptive title for your question"
                    variant="bordered"
                    size="lg"
                    classNames={{
                      input: 'text-gray-900 dark:text-white',
                      inputWrapper:
                        'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 focus-within:border-blue-500 dark:focus-within:border-blue-400 bg-white dark:bg-gray-800',
                    }}
                  />
                </motion.div>

                {/* Content Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Question Content <span className="text-red-500">*</span>
                  </label>
                  <div className="border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden bg-white dark:bg-gray-800 hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                    <Editor
                      initialContent={editQuestionData.content}
                      onChange={content => setEditQuestionData(prev => ({ ...prev, content }))}
                      placeholder="Describe your question in detail. Include what you've tried and what specific help you need."
                      minHeight="150px"
                      maxHeight="300px"
                    />
                  </div>
                </motion.div>

                {/* Tags Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Tags
                  </label>

                  {/* Add Tag Input */}
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={e => setNewTag(e.target.value)}
                      placeholder="Add a relevant tag (e.g., javascript, react, css)"
                      variant="bordered"
                      size="md"
                      onKeyPress={e => e.key === 'Enter' && handleAddTag()}
                      classNames={{
                        input: 'text-gray-900 dark:text-white',
                        inputWrapper:
                          'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 focus-within:border-blue-500 dark:focus-within:border-blue-400 bg-white dark:bg-gray-800',
                      }}
                    />
                    <Button
                      onPress={handleAddTag}
                      isDisabled={!newTag.trim() || editQuestionData.tags.includes(newTag.trim())}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                      startContent={<Plus className="w-4 h-4" />}
                    >
                      Add
                    </Button>
                  </div>

                  {/* Tags Display */}
                  <AnimatePresence>
                    {editQuestionData.tags.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        {editQuestionData.tags.map((tag, index) => (
                          <motion.span
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ delay: index * 0.05 }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800 shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 p-0.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </motion.span>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </ModalBody>

            <ModalFooter className="gap-3 py-4">
              <Button
                variant="bordered"
                onPress={onClose}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium px-6"
              >
                Cancel
              </Button>
              <Button
                onPress={handleSubmit}
                isLoading={isLoading}
                isDisabled={!editQuestionData.title.trim() || !editQuestionData.content.trim()}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium px-8 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                startContent={!isLoading && <Edit3 className="w-4 h-4" />}
              >
                {isLoading ? 'Updating...' : 'Update Question'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditQuestionModal;
