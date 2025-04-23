import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './components/contexts/LanguageContext';
import { AuthProvider } from './components/contexts/AuthContext.jsx';
// import { LanguageProvider } from './components/contexts/LanguageContext';
import { ThemeProvider } from './components/contexts/ThemeContext';
import { NotificationProvider } from './components/contexts/NotificationContext';
import AppRoutes from './components/routes';
// import GuidePage from './pages/GuidePage'; // You might need this later if GuidePage is not part of AppRoutes
// Remove unused imports causing the error
// import Header from './components/common/Header'; // Giả sử có Header
// import Footer from './components/common/Footer'; // Giả sử có Footer

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