import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react';
import { Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';
import Editor from '../Global/Editor';

interface EditAnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  editAnswerContent: string;
  setEditAnswerContent: (content: string) => void;
  handleUpdateAnswer: () => Promise<void>;
}

const EditAnswerModal: React.FC<EditAnswerModalProps> = ({
  isOpen,
  onClose,
  editAnswerContent,
  setEditAnswerContent,
  handleUpdateAnswer,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await handleUpdateAnswer();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="4xl"
      backdrop="blur"
      classNames={{
        base: 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50',
        header:
          'border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20',
        body: 'py-4 px-6',
        footer:
          'border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50',
      }}
    >
      <ModalContent className="max-h-[80vh]">
        {onModalClose => (
          <>
            <ModalHeader className="flex flex-col gap-1 pb-4">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
              >
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Answer</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Update your answer content and improve your response
                  </p>
                </div>
              </motion.div>
            </ModalHeader>

            <ModalBody className="overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Answer Content <span className="text-red-500">*</span>
                </label>
                <div className="border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden bg-white dark:bg-gray-800 hover:border-green-500 dark:hover:border-green-400 transition-colors">
                  <Editor
                    initialContent={editAnswerContent}
                    onChange={setEditAnswerContent}
                    placeholder="Provide a detailed and helpful answer. Include code examples, explanations, and any relevant resources."
                    minHeight="150px"
                    maxHeight="300px"
                  />
                </div>
              </motion.div>
            </ModalBody>

            <ModalFooter className="gap-3 py-4">
              <Button
                variant="bordered"
                onPress={onModalClose}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium px-6"
              >
                Cancel
              </Button>
              <Button
                onPress={handleSubmit}
                isLoading={isLoading}
                isDisabled={!editAnswerContent.trim()}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium px-8 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                startContent={!isLoading && <Edit3 className="w-4 h-4" />}
              >
                {isLoading ? 'Updating...' : 'Update Answer'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditAnswerModal;
