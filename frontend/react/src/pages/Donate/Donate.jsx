import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Snackbar,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import './Donate.css';

// Import custom hooks
import { useDonation } from '../../components/hooks/useDonation';

// Import components
import DonationInfo from '../../features/Donate/components/DonationInfo';
import AnimalShowcase from '../../features/Donate/components/AnimalShowcase';
import PaymentMethods from '../../features/Donate/components/PaymentMethods';
import RescueStories from '../../features/Donate/components/RescueStories';

const Donate = () => {
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
  
  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3,
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

  return (
    <Container maxWidth={false} className="donate-container" sx={{ px: { xs: 2, sm: 3, md: 5 }, maxWidth: '1600px', mx: 'auto' }}>
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
        
        <Grid container spacing={4} className="donate-content">
          {/* Phần thông tin quyên góp */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <DonationInfo rescueStats={rescueStats} />
            </motion.div>
          </Grid>
          
          {/* Phần hình ảnh động vật */}
          <Grid item xs={12} md={6}>
            <motion.div variants={itemVariants}>
              <AnimalShowcase 
                rescueImages={rescueImages} 
                currentImageIndex={currentImageIndex}
                setCurrentImageIndex={setCurrentImageIndex}
              />
            </motion.div>
            
            {/* Đã xóa phần donation-quote-container ở đây */}
          </Grid>
        </Grid>
        
        {/* Phần phương thức thanh toán */}
        <motion.div variants={itemVariants}>
          <PaymentMethods 
            activeTab={activeTab}
            handleChangeTab={handleChangeTab}
            qrCodes={qrCodes}
            accountDetails={accountDetails}
            handleCopy={handleCopy}
          />
        </motion.div>
        
        {/* Phần câu chuyện cứu hộ */}
        <motion.div variants={itemVariants}>
          <RescueStories rescueImages={rescueImages} />
        </motion.div>
      </motion.div>
      
      <Snackbar open={copySuccess} autoHideDuration={2000} onClose={() => setCopySuccess(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Đã sao chép vào clipboard!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Donate;