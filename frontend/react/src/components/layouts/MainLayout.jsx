import React from 'react';
import TopBar from '../common/TopBar';
import Navigation from '../common/Navigation';
import Footer from '../common/Footers';
import { useLocation } from 'react-router-dom';
import '../../assets/styles/main.css';


const MainLayout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname.includes('/auth');

  return (
    <div className={`layout-wrapper ${isAuthPage ? 'auth-page' : ''}`}>
      <TopBar />
      <Navigation />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;