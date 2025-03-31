import React from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import { LanguageProvider } from './components/contexts/LanguageContext';
import { AuthProvider } from './components/contexts/AuthContext';
import { ThemeProvider } from './components/contexts/ThemeContext';
import { NotificationProvider } from './components/contexts/NotificationContext';
import AppRoutes from './components/routes';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <Routes>
                {AppRoutes()}
              </Routes>
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;