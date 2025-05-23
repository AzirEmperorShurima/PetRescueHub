import React from 'react';
import { Box } from '@chakra-ui/react';
import { Outlet, useLocation } from 'react-router-dom';
import TopBar from '../common/TopBar';
import Navigation from '../common/Navigation';
import Footer from '../common/Footers';

const MainLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname.includes('/auth');

  return (
    <Box
      className={isAuthPage ? 'auth-page' : ''}
      display="flex"
      flexDirection="column"
      minH="100vh"
      pt={isAuthPage ? 0 : '40px'}
    >
      {!isAuthPage && <TopBar />}
      {!isAuthPage && <Navigation />}

      <Box
        as="main"
        flex="1"
        mt={isAuthPage ? 0 : '60px'}
        pt={isAuthPage ? 0 : '20px'}
        overflow="visible"
        position="relative" // Thêm để đảm bảo layout ổn định
      >
        <Outlet />
      </Box>

      {/* Wrapper cho Footer để tránh CSS conflicts */}
      {!isAuthPage && (
        <Box 
          as="footer" 
          position="relative"
          overflow="visible" // Đảm bảo animation không bị ẩn
          zIndex={1}
        >
          <Footer />
        </Box>
      )}
    </Box>
  );
};

export default MainLayout;
