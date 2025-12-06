import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Toaster, ToastProps } from '../ui/toaster';

export interface ToastOptions {
  type?: 'info' | 'warning' | 'error' | 'success';
  duration?: number;
  closable?: boolean;
  onClose?: () => void;
}

interface ToasterContextType {
  showToast: (title: string, message?: string, options?: ToastOptions) => string;
  showInfo: (title: string, message?: string, options?: Omit<ToastOptions, 'type'>) => string;
  showSuccess: (title: string, message?: string, options?: Omit<ToastOptions, 'type'>) => string;
  showWarning: (title: string, message?: string, options?: Omit<ToastOptions, 'type'>) => string;
  showError: (title: string, message?: string, options?: Omit<ToastOptions, 'type'>) => string;
  hideToast: (id: string) => void;
  hideAllToasts: () => void;
}

const ToasterContext = createContext<ToasterContextType | undefined>(undefined);

interface ToasterProviderProps {
  children: ReactNode;
  maxToasts?: number;
}

export const ToasterProvider: React.FC<ToasterProviderProps> = ({
  children,
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const generateId = (): string => {
    return `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const showToast = (
    title: string,
    message?: string,
    options: ToastOptions = {}
  ): string => {
    const id = generateId();
    const {
      type = 'info',
      duration = 4000,
      closable = true,
      onClose,
    } = options;

    const newToast: ToastProps = {
      id,
      type,
      title,
      message,
      duration,
      closable,
      onClose,
    };

    setToasts((prevToasts) => {
      const updatedToasts = [newToast, ...prevToasts];
      // Limit the number of toasts
      return updatedToasts.slice(0, maxToasts);
    });

    return id;
  };

  const showInfo = (
    title: string,
    message?: string,
    options: Omit<ToastOptions, 'type'> = {}
  ): string => {
    return showToast(title, message, { ...options, type: 'info' });
  };

  const showSuccess = (
    title: string,
    message?: string,
    options: Omit<ToastOptions, 'type'> = {}
  ): string => {
    return showToast(title, message, { ...options, type: 'success' });
  };

  const showWarning = (
    title: string,
    message?: string,
    options: Omit<ToastOptions, 'type'> = {}
  ): string => {
    return showToast(title, message, { ...options, type: 'warning' });
  };

  const showError = (
    title: string,
    message?: string,
    options: Omit<ToastOptions, 'type'> = {}
  ): string => {
    return showToast(title, message, { ...options, type: 'error' });
  };

  const hideToast = (id: string): void => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const hideAllToasts = (): void => {
    setToasts([]);
  };

  const contextValue: ToasterContextType = {
    showToast,
    showInfo,
    showSuccess,
    showWarning,
    showError,
    hideToast,
    hideAllToasts,
  };

  return (
    <ToasterContext.Provider value={contextValue}>
      {children}
      <Toaster toasts={toasts} onRemove={hideToast} />
    </ToasterContext.Provider>
  );
};

export const useToaster = (): ToasterContextType => {
  const context = useContext(ToasterContext);
  if (context === undefined) {
    throw new Error('useToaster must be used within a ToasterProvider');
  }
  return context;
};