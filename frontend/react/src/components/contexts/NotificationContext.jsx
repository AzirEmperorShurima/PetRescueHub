import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info', // 'error', 'warning', 'info', 'success'
    autoHideDuration: 6000
  });

  const showNotification = useCallback((message, severity = 'info', autoHideDuration = 6000) => {
    setNotification({
      open: true,
      message,
      severity,
      autoHideDuration
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  }, []);

  const showSuccess = useCallback((message, autoHideDuration) => {
    showNotification(message, 'success', autoHideDuration);
  }, [showNotification]);

  const showError = useCallback((message, autoHideDuration) => {
    showNotification(message, 'error', autoHideDuration);
  }, [showNotification]);

  const showWarning = useCallback((message, autoHideDuration) => {
    showNotification(message, 'warning', autoHideDuration);
  }, [showNotification]);

  const showInfo = useCallback((message, autoHideDuration) => {
    showNotification(message, 'info', autoHideDuration);
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
      <Snackbar
        open={notification.open}
        autoHideDuration={notification.autoHideDuration}
        onClose={hideNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={hideNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

export default NotificationContext;