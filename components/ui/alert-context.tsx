import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AlertModal, AlertProps, AlertButton, AlertButtonStyle, AlertTextAreaConfig } from './alert-modal';

export interface AlertOptions {
  title: string;
  message?: string;
  buttons?: AlertButton[];
  textArea?: AlertTextAreaConfig;
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => string;
  showConfirm: (
    title: string,
    message?: string,
    onConfirm?: () => void,
    onCancel?: () => void
  ) => string;
  showDeleteConfirm: (
    title: string,
    message?: string,
    onDelete?: () => void,
    onCancel?: () => void
  ) => string;
  showSimpleAlert: (title: string, message?: string, onOk?: () => void) => string;
  showTextAreaAlert: (
    title: string,
    message?: string,
    textAreaConfig?: AlertTextAreaConfig,
    onSubmit?: (text: string) => void,
    onCancel?: () => void
  ) => string;
  hideAlert: (id: string) => void;
  hideAllAlerts: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertProps[]>([]);

  const generateId = (): string => {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const showAlert = (options: AlertOptions): string => {
    const id = generateId();
    const { title, message, buttons = [{ text: 'OK' }], textArea } = options;

    const newAlert: AlertProps = {
      id,
      title,
      message,
      buttons,
      visible: true,
      onClose: () => hideAlert(id),
      textArea,
    };

    /* istanbul ignore next */
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
    return id;
  };

  const showSimpleAlert = (
    title: string,
    message?: string,
    onOk?: () => void
  ): string => {
    return showAlert({
      title,
      message,
      buttons: [
        {
          text: 'OK',
          style: 'default',
          onPress: onOk,
        },
      ],
    });
  };

  const showConfirm = (
    title: string,
    message?: string,
    onConfirm?: () => void,
    onCancel?: () => void
  ): string => {
    return showAlert({
      title,
      message,
      buttons: [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: onCancel,
        },
        {
          text: 'OK',
          style: 'default',
          onPress: onConfirm,
        },
      ],
    });
  };

  const showDeleteConfirm = (
    title: string,
    message?: string,
    onDelete?: () => void,
    onCancel?: () => void
  ): string => {
    return showAlert({
      title,
      message,
      buttons: [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: onCancel,
        },
        {
          text: 'OK',
          style: 'default',
          onPress: () => {}, // Empty function for OK
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: onDelete,
        },
      ],
    });
  };

  const showTextAreaAlert = (
    title: string,
    message?: string,
    textAreaConfig?: AlertTextAreaConfig,
    onSubmit?: (text: string) => void,
    onCancel?: () => void
  ): string => {
    const config: AlertTextAreaConfig = {
      maxLength: 255,
      multiline: true,
      placeholder: 'Enter your text...',
      ...textAreaConfig,
    };

    return showAlert({
      title,
      message,
      textArea: config,
      buttons: [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: onCancel,
        },
        {
          text: 'Submit',
          style: 'default',
          onPress: (inputValue?: string) => {
            /* istanbul ignore next */
            if (onSubmit && inputValue !== undefined) {
              /* istanbul ignore next */
              onSubmit(inputValue);
            }
          },
        },
      ],
    });
  };

  const hideAlert = (id: string): void => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === id ? { ...alert, visible: false } : alert
      )
    );

    // Remove from array after animation completes
    setTimeout(() => {
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
    }, 200);
  };

  const hideAllAlerts = (): void => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) => ({ ...alert, visible: false }))
    );

    // Clear all after animation completes
    setTimeout(() => {
      setAlerts([]);
    }, 200);
  };

  const contextValue: AlertContextType = {
    showAlert,
    showSimpleAlert,
    showConfirm,
    showDeleteConfirm,
    showTextAreaAlert,
    hideAlert,
    hideAllAlerts,
  };

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      {alerts.map((alert) => (
        <AlertModal key={alert.id} {...alert} />
      ))}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};