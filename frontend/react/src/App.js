import React from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {AppRoutes()}
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;