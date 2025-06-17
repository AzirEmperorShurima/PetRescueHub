import React from 'react';
import { Box } from '@chakra-ui/react';

const TabPanel = ({ children, isActive }) => {
  return (
    <Box 
      className={`profile-tab-panel ${isActive ? 'active' : ''}`}
      role="tabpanel"
    >
      {children}
    </Box>
  );
};

export default TabPanel;