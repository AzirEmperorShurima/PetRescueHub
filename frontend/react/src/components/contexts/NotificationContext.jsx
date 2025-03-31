import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import PropTypes from 'prop-types';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info' // 'error', 'warning', 'info', 'success'
  });

  const showNotification = (message, severity = 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const hideNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  // Convenience methods
  const showError = (message) => showNotification(message, 'error');
  const showSuccess = (message) => showNotification(message, 'success');
  const showInfo = (message) => showNotification(message, 'info');
  const showWarning = (message) => showNotification(message, 'warning');

  return (
    <NotificationContext.Provider 
      value={{ 
        showNotification, 
        showError, 
        showSuccess, 
        showInfo, 
        showWarning 
      }}
    >
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={hideNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={hideNotification} 
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired
};