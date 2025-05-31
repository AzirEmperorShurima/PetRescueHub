import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { LanguageProvider } from './components/contexts/LanguageContext';
import { AuthProvider } from './components/contexts/AuthContext.jsx';
import { NotificationProvider } from './components/contexts/NotificationContext';
import ErrorBoundary from './components/common/Error/ErrorBoundary.jsx';
import AppRoutes from './routes/index.routing.jsx';
import ChatbotWidget from './pages/Home/components/Chatbot/ChatbotWidget.jsx';
import RescueButton from './components/button/RescueButton.jsx';

// Component để kiểm tra đường dẫn hiện tại
const ConditionalComponents = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && (
        <>
          <ChatbotWidget />
          <RescueButton />
        </>
      )}
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <LanguageProvider>
          <AuthProvider>
            <NotificationProvider>
              <AppRoutes />
              <ConditionalComponents />
            </NotificationProvider>
          </AuthProvider>
        </LanguageProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;