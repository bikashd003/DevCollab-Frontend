import React from 'react';
import { Modal, ModalContent, Button } from '@nextui-org/react';
import { AlertTriangle, Trash2, Info, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <Trash2 className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'danger':
        return {
          confirmButton: 'bg-red-500 hover:bg-red-600 text-white',
          iconBg: 'bg-red-50 dark:bg-red-950/50',
          accent: 'text-red-600 dark:text-red-400',
        };
      case 'warning':
        return {
          confirmButton: 'bg-amber-500 hover:bg-amber-600 text-white',
          iconBg: 'bg-amber-50 dark:bg-amber-950/50',
          accent: 'text-amber-600 dark:text-amber-400',
        };
      case 'info':
        return {
          confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white',
          iconBg: 'bg-blue-50 dark:bg-blue-950/50',
          accent: 'text-blue-600 dark:text-blue-400',
        };
      case 'success':
        return {
          confirmButton: 'bg-emerald-500 hover:bg-emerald-600 text-white',
          iconBg: 'bg-emerald-50 dark:bg-emerald-950/50',
          accent: 'text-emerald-600 dark:text-emerald-400',
        };
      default:
        return {
          confirmButton: 'bg-amber-500 hover:bg-amber-600 text-white',
          iconBg: 'bg-amber-50 dark:bg-amber-950/50',
          accent: 'text-amber-600 dark:text-amber-400',
        };
    }
  };

  const colors = getColors();

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="sm"
      placement="top"
      classNames={{
        wrapper: 'items-start pt-16 sm:pt-20',
        base: 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl',
        header: 'border-none px-0 py-0',
        body: 'px-0 py-0',
        footer: 'border-none px-0 py-0',
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
              duration: 0.3,
              ease: 'easeOut',
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            scale: 0.95,
            transition: {
              duration: 0.2,
              ease: 'easeIn',
            },
          },
        },
      }}
    >
      <ModalContent className="rounded-2xl overflow-hidden">
        {onModalClose => (
          <div className="p-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-4 mb-4"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
                className={`p-3 rounded-xl ${colors.iconBg} ring-1 ring-gray-200/20 dark:ring-gray-700/20`}
              >
                {getIcon()}
              </motion.div>
              <div className="flex-1 min-w-0">
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="text-lg font-semibold text-gray-900 dark:text-white mb-1"
                >
                  {title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed"
                >
                  {message}
                </motion.p>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex justify-end gap-3 pt-2"
            >
              <Button
                variant="ghost"
                onPress={onModalClose}
                disabled={isLoading}
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium px-4 h-10"
              >
                {cancelText}
              </Button>
              <Button
                onPress={onConfirm}
                isLoading={isLoading}
                className={`${colors.confirmButton} font-medium px-6 h-10 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg`}
              >
                {confirmText}
              </Button>
            </motion.div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmDialog;
