import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { LanguageProvider } from './components/contexts/LanguageContext';
import { AuthProvider } from './components/contexts/AuthContext.jsx';
import { NotificationProvider } from './components/contexts/NotificationContext';
import ErrorBoundary from './components/common/Error/ErrorBoundary.jsx';
import AppRoutes from './routes/index.routing.jsx';
import ChatbotWidget from './pages/Home/components/Chatbot/ChatbotWidget.jsx';
import RescueButton from './components/button/RescueButton.jsx';

function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;