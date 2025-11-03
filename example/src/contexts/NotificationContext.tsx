import React, { createContext, useContext, useState, ReactNode } from 'react';

export type NotificationSeverity = 'success' | 'error' | 'warning' | 'info';

export interface NotificationMessage {
  id: string;
  message: string;
  severity: NotificationSeverity;
  autoHideDuration?: number;
}

interface NotificationContextType {
  notifications: NotificationMessage[];
  showSuccess: (message: string, autoHideDuration?: number) => void;
  showError: (message: string, autoHideDuration?: number) => void;
  showWarning: (message: string, autoHideDuration?: number) => void;
  showInfo: (message: string, autoHideDuration?: number) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

  const addNotification = (severity: NotificationSeverity, message: string, autoHideDuration?: number) => {
    const id = Date.now().toString();
    const newNotification: NotificationMessage = {
      id,
      message,
      severity,
      autoHideDuration: autoHideDuration || 6000
    };

    console.log('添加新通知：', newNotification);
    setNotifications(prev => {
      const newNotifications = [...prev, newNotification];
      console.log('更新后的通知列表：', newNotifications);
      return newNotifications;
    });

    // 如果设置了自动隐藏，则在指定时间后自动移除
    if (autoHideDuration && autoHideDuration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, autoHideDuration);
    }
  };

  const showSuccess = (message: string, autoHideDuration?: number) => {
    addNotification('success', message, autoHideDuration);
  };

  const showError = (message: string, autoHideDuration?: number) => {
    console.log('NotificationContext.showError被调用，消息：', message);
    addNotification('error', message, autoHideDuration);
  };

  const showWarning = (message: string, autoHideDuration?: number) => {
    addNotification('warning', message, autoHideDuration);
  };

  const showInfo = (message: string, autoHideDuration?: number) => {
    addNotification('info', message, autoHideDuration);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const value: NotificationContextType = {
    notifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearAll
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
