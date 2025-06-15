import { useState } from 'react';

interface ConfirmDialogConfig {
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  confirmText?: string;
  cancelText?: string;
}

interface UseConfirmDialogReturn {
  isOpen: boolean;
  isLoading: boolean;
  config: ConfirmDialogConfig;
  openDialog: (config: ConfirmDialogConfig) => Promise<boolean>;
  closeDialog: () => void;
  setLoading: (loading: boolean) => void;
}

export const useConfirmDialog = (): UseConfirmDialogReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<ConfirmDialogConfig>({
    title: '',
    message: '',
    type: 'warning',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
  });
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  const openDialog = (dialogConfig: ConfirmDialogConfig): Promise<boolean> => {
    setConfig(dialogConfig);
    setIsOpen(true);
    setIsLoading(false);

    return new Promise<boolean>(resolve => {
      setResolvePromise(() => resolve);
    });
  };

  const closeDialog = () => {
    setIsOpen(false);
    setIsLoading(false);
    if (resolvePromise) {
      resolvePromise(false);
      setResolvePromise(null);
    }
  };

  const confirmDialog = () => {
    if (resolvePromise) {
      resolvePromise(true);
      setResolvePromise(null);
    }
    setIsOpen(false);
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return {
    isOpen,
    isLoading,
    config,
    openDialog,
    closeDialog: closeDialog,
    setLoading,
    // Add confirmDialog for internal use
    confirmDialog,
  } as UseConfirmDialogReturn & { confirmDialog: () => void };
};

export default useConfirmDialog;
