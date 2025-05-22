import React, { createContext, useContext, useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const toast = useToast();

  const showNotification = useCallback((message, status = 'info', duration = 6000) => {
    toast({
      title: message,
      status,
      duration,
      isClosable: true,
      position: 'bottom-right'
    });
  }, [toast]);

  const hideNotification = useCallback(() => {
    // Trong Chakra UI, không cần phải đóng toast theo cách thủ công
    // Toast sẽ tự động đóng sau khi hết thời gian duration
  }, []);

  const showSuccess = useCallback((message, duration) => {
    showNotification(message, 'success', duration);
  }, [showNotification]);

  const showError = useCallback((message, duration) => {
    showNotification(message, 'error', duration);
  }, [showNotification]);

  const showWarning = useCallback((message, duration) => {
    showNotification(message, 'warning', duration);
  }, [showNotification]);

  const showInfo = useCallback((message, duration) => {
    showNotification(message, 'info', duration);
  }, [showNotification]);

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        hideNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

export default NotificationContext;