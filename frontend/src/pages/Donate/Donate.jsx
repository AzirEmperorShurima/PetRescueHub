import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import './Donate.css';
// Import custom hooks
// Import custom hooks
import { useDonation } from '../../components/hooks/useDonation';
// Import components
import DonationInfo from './components/DonationInfo';
import AnimalShowcase from './components/AnimalShowcase';
import PaymentMethods from './components/PaymentMethods';
import RescueStories from './components/RescueStories';

const Donate = () => {
  // Use theme for responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Use the custom hook to manage all donation-related state and logic
  const {
    copySuccess,
    activeTab,
    currentImageIndex,
    qrCodes,
    accountDetails,
    rescueImages,
    rescueStats,
    handleCopy,
    handleChangeTab,
    setCopySuccess,
    setCurrentImageIndex
  } = useDonation();
 
  // Animation variants with responsiveness in mind
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.2 : 0.3,
        delayChildren: 0.2
      }
    }
  };
 
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Cleanup function for any event listeners or timers
  useEffect(() => {
    return () => {
      // Cleanup logic here if needed
    };
  }, []);

  return (
    <Container 
      maxWidth={false} 
      className="donate-container" 
      sx={{ 
        px: { xs: 2, sm: 3, md: 5 }, 
        maxWidth: '1600px', 
        mx: 'auto',
        py: { xs: 3, md: 5 } // Add responsive padding
      }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="donate-content-wrapper"
      >
        <motion.div variants={itemVariants} className="donate-header">
          <Typography variant="h2" component="h1" className="donate-title">
            Chia Sẻ Yêu Thương
          </Typography>
        </motion.div>
       
        <Grid container spacing={{ xs: 2, md: 4 }} className="donate-content">
          {/* Donation information section */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <DonationInfo rescueStats={rescueStats} />
            </motion.div>
          </Grid>
         
          {/* Animal showcase section */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <AnimalShowcase
                rescueImages={rescueImages}
                currentImageIndex={currentImageIndex}
                setCurrentImageIndex={setCurrentImageIndex}
              />
            </motion.div>
          </Grid>
        </Grid>
       
        {/* Payment methods section */}
        <motion.div variants={itemVariants}>
          <PaymentMethods
            activeTab={activeTab}
            handleChangeTab={handleChangeTab}
            qrCodes={qrCodes}
            accountDetails={accountDetails}
            handleCopy={handleCopy}
          />
        </motion.div>
       
        {/* Rescue stories section */}
        <motion.div variants={itemVariants}>
          <RescueStories rescueImages={rescueImages} />
        </motion.div>
      </motion.div>
     
      <Snackbar 
        open={copySuccess} 
        autoHideDuration={2000} 
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Đã sao chép vào clipboard!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Donate;