import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import TopBar from '../common/TopBar';
import Navigation from '../common/Navigation';
import Footer from '../common/Footers';
import { Box } from '@mui/material';

const MainLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname.includes('/auth');

  return (
    <Box 
      className={isAuthPage ? 'auth-page' : ''}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        paddingTop: isAuthPage ? 0 : '40px' // Thêm padding-top cho non-auth pages
      }}
    >
      {!isAuthPage && <TopBar />}
      {!isAuthPage && <Navigation />}
      <Box 
        component="main"
        sx={{ 
          flex: 1,
          marginTop: isAuthPage ? 0 : '80px', // Không cần margin-top cho trang auth
          paddingTop: isAuthPage ? 0 : '20px'
        }}
      >
        <Outlet />
      </Box>
      {!isAuthPage && <Footer />}
    </Box>
  );
};

export default MainLayout;