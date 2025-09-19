import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, AlertTriangle } from 'lucide-react';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from '@nextui-org/react';
import { useMutation } from '@apollo/client';
import { DELETE_CURRENT_USER_ACCOUNT } from '../GraphQL/Mutations/Profile/User';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../Secure/AuthContext';
import PageContainer from '../Components/Profile/PageContainer';

const Settings: React.FC = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  const [deleteAccount] = useMutation(DELETE_CURRENT_USER_ACCOUNT, {
    onCompleted: async data => {
      if (data.deleteCurrentUserAccount.success) {
        toast.success('Account deleted successfully');
        await handleLogout();
        localStorage.clear();
        sessionStorage.clear();
        navigate('/');
      }
    },
    onError: error => {
      toast.error(`Failed to delete account: ${error.message}`);
      setIsDeleting(false);
    },
  });

  const handleDeleteAccount = async () => {
    if (confirmationText !== 'DELETE') {
      toast.error('Please type "DELETE" to confirm');
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAccount();
    } catch (error: any) {
      toast.error(`Failed to delete account: ${error.message}`);
    }
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
    setConfirmationText('');
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setConfirmationText('');
    setIsDeleting(false);
  };

  return (
    <PageContainer>
      <div className="w-full max-w-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-red-500/10 border border-red-500/20 rounded-2xl overflow-hidden"
        >
          {/* Section Header */}
          <div className="p-6 border-b border-red-500/20 bg-gradient-to-r from-red-500/10 to-orange-500/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-red-400">Danger Zone</h2>
            </div>
          </div>

          {/* Delete Account Content */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-white mb-2 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </h3>
                <p className="text-slate-400 text-sm mb-2">
                  Permanently delete your account and all associated data
                </p>
                <div className="text-xs text-red-400 space-y-1">
                  <p>• All your projects, skills, and profile information will be deleted</p>
                  <p>• Your questions, answers, and comments will be removed</p>
                  <p>• This action cannot be undone</p>
                </div>
              </div>
              <div className="ml-6">
                <Button
                  color="danger"
                  variant="bordered"
                  size="sm"
                  onPress={openDeleteModal}
                  startContent={<Trash2 className="w-4 h-4" />}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          classNames={{
            backdrop: 'bg-black/50 backdrop-blur-sm',
            base: 'border border-red-500/20 bg-slate-900',
            header: 'border-b border-red-500/20',
            body: 'py-6',
            footer: 'border-t border-red-500/20',
          }}
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                Confirm Account Deletion
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <p className="text-slate-300">
                  This action will permanently delete your account and all associated data. This
                  cannot be undone.
                </p>

                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <h4 className="text-red-400 font-medium mb-2">What will be deleted:</h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Your profile and personal information</li>
                    <li>• All projects and skills</li>
                    <li>• Questions, answers, and comments</li>
                    <li>• Account settings and preferences</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Type <span className="text-red-400 font-bold">DELETE</span> to confirm:
                  </label>
                  <Input
                    value={confirmationText}
                    onChange={e => setConfirmationText(e.target.value)}
                    placeholder="Type DELETE here"
                    classNames={{
                      input: 'bg-slate-800 text-white',
                      inputWrapper: 'bg-slate-800 border-slate-600 hover:border-slate-500',
                    }}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="bordered"
                onPress={closeDeleteModal}
                className="border-slate-600 text-slate-300"
              >
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={handleDeleteAccount}
                isLoading={isDeleting}
                isDisabled={confirmationText !== 'DELETE'}
                startContent={!isDeleting && <Trash2 className="w-4 h-4" />}
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </PageContainer>
  );
};

export default Settings;
