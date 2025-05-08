import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { LanguageProvider } from './components/contexts/LanguageContext';
import { AuthProvider } from './components/contexts/AuthContext';
import { ThemeProvider } from './components/contexts/ThemeContext';
import { NotificationProvider } from './components/contexts/NotificationContext';
import ErrorBoundary from './components/common/Error/ErrorBoundary.jsx';
import AppRoutes from './routes/index.routing.js';
import ChatbotWidget from './pages/Home/components/Chatbot/ChatbotWidget';
import RescueButton from './components/button/RescueButton.jsx';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        {/* Router phải bao tất cả các Provider dùng useNavigate, useRoutes,… */}
        <Router>
          <LanguageProvider>
            <AuthProvider>
              <NotificationProvider>
                <AppRoutes />
                <ChatbotWidget />
                <RescueButton />
              </NotificationProvider>
            </AuthProvider>
          </LanguageProvider>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
