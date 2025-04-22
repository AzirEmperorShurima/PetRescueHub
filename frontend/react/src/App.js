import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { LanguageProvider } from './components/contexts/LanguageContext';
import { AuthProvider } from './components/contexts/AuthContext';
import { ThemeProvider } from './components/contexts/ThemeContext';
import { NotificationProvider } from './components/contexts/NotificationContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppRoutes from './routes/index.js';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <NotificationProvider>
              <Router>
                <AppRoutes />
              </Router>
            </NotificationProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;