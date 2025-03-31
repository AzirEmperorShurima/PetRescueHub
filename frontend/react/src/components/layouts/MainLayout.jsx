import React from 'react';
import TopBar from '../common/TopBar';
import Navigation from '../common/Navigation';
import Footer from '../common/Footers';
import { useLocation, Outlet } from 'react-router-dom';
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
        minHeight: '100vh'
      }}
    >
      <TopBar />
      <Navigation />
      <Box 
        component="main"
        sx={{ 
          flex: 1,
          marginTop: 0, 
          paddingTop: 0 
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;