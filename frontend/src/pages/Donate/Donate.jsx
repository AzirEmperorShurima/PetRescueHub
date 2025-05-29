import React, { useEffect } from 'react';
import {
  Container,
  Heading,
  Grid,
  useBreakpointValue,
  useToast,
  Box,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useDonation } from '../../components/hooks/useDonation';
import DonationInfo from './components/DonationInfo';
import AnimalShowcase from './components/AnimalShowcase';
import PaymentMethods from './components/PaymentMethods';
import RescueStories from './components/RescueStories';
// Motion components
const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

const Donate = () => {
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
    setCurrentImageIndex,
  } = useDonation();

  // Theme colors
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, teal.50, green.50)',
    'linear(to-br, gray.900, teal.900, blue.900)'
  );
  const headingColor = useColorModeValue('teal.600', 'teal.200');

  // Responsive values
  const staggerChildren = useBreakpointValue({ base: 0.15, md: 0.2, lg: 0.25 });
  const containerPadding = useBreakpointValue({ base: 4, md: 6, lg: 8 });
  const spacing = useBreakpointValue({ base: 6, md: 8, lg: 10 });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerChildren,
        delayChildren: 0.3,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      y: 30, 
      opacity: 0,
      scale: 0.95
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { 
        type: 'spring', 
        stiffness: 100,
        damping: 15,
        duration: 0.6
      },
    },
  };

  const headingVariants = {
    hidden: { 
      y: -20, 
      opacity: 0,
      scale: 0.9
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { 
        type: 'spring', 
        stiffness: 120,
        damping: 20,
        duration: 0.8
      },
    },
  };

  // Toast notification
  const toast = useToast();
  useEffect(() => {
    if (copySuccess) {
      toast({
        title: 'Thành công!',
        description: 'Đã sao chép thông tin vào clipboard',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
        variant: 'subtle',
      });
      const timer = setTimeout(() => setCopySuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess, setCopySuccess, toast]);

  return (
    <Box
      minH="100vh"
      bgGradient={bgGradient}
      py={containerPadding}
    >
      <Container
        maxW="1400px"
        px={containerPadding}
      >
        <MotionVStack
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          spacing={spacing}
          align="stretch"
        >
          {/* Header Section */}
          <MotionBox 
            variants={headingVariants}
            textAlign="center"
          >
            <Heading
              as="h1"
              size={{ base: 'xl', md: '2xl', lg: '3xl' }}
              color={headingColor}
              fontWeight="bold"
              letterSpacing="tight"
              mb={4}
            >
              🐾 Chia Sẻ Yêu Thương 🐾
            </Heading>
            <Box
              w={{ base: '60px', md: '80px' }}
              h="4px"
              bg="teal.400"
              mx="auto"
              borderRadius="full"
              bgGradient="linear(to-r, teal.400, blue.400)"
            />
          </MotionBox>

          {/* Main Content Grid */}
          <MotionBox variants={itemVariants}>
            <Grid
              templateColumns={{ 
                base: '1fr', 
                lg: '1fr 1fr' 
              }}
              gap={{ base: 6, md: 8 }}
              alignItems="start"
            >
              <MotionBox
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <DonationInfo rescueStats={rescueStats} />
              </MotionBox>
              
              <MotionBox
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <AnimalShowcase
                  rescueImages={rescueImages}
                  currentImageIndex={currentImageIndex}
                  setCurrentImageIndex={setCurrentImageIndex}
                />
              </MotionBox>
            </Grid>
          </MotionBox>

          {/* Payment Methods */}
          <MotionBox 
            variants={itemVariants}
            id="payment-methods"
          >
            <PaymentMethods
              activeTab={activeTab}
              handleChangeTab={handleChangeTab}
              qrCodes={qrCodes}
              accountDetails={accountDetails}
              handleCopy={handleCopy}
            />
          </MotionBox>

          {/* Rescue Stories */}
          <MotionBox variants={itemVariants}>
            <RescueStories rescueImages={rescueImages} />
          </MotionBox>
        </MotionVStack>
      </Container>
    </Box>
  );
};

export default Donate;