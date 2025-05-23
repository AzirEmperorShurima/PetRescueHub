import React from 'react';
import {
  Box,
  Text,
  Button,
  VStack,
  HStack,
  useColorModeValue,
  IconButton,
  Fade,
  ScaleFade,
  useBreakpointValue,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import LazyImage from '../../../components/common/interactions/LazyImage';

// Motion components
const MotionBox = motion(Box);

const AnimalShowcase = ({ rescueImages, currentImageIndex, setCurrentImageIndex }) => {
  // Theme colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const overlayBg = useColorModeValue('blackAlpha.600', 'blackAlpha.700');
  const textColor = useColorModeValue('white', 'white');
  const shadowColor = useColorModeValue('lg', 'dark-lg');

  // Responsive values
  const imageHeight = useBreakpointValue({ base: '300px', md: '400px', lg: '450px' });
  const buttonSize = useBreakpointValue({ base: 'md', md: 'lg' });
  const fontSize = useBreakpointValue({ base: 'lg', md: 'xl', lg: '2xl' });

  // Captions for images
  const captions = [
    "Mỗi sinh mạng đều đáng quý 💝",
    "We need your help and support 🙏",
    "Hãy chung tay vì những người bạn bé nhỏ 🐾"
  ];

  // Navigation functions
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % rescueImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + rescueImages.length) % rescueImages.length);
  };

  const scrollToPayment = () => {
    const element = document.getElementById('payment-methods');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Box
      bg={cardBg}
      borderRadius="2xl"
      overflow="hidden"
      shadow={shadowColor}
      position="relative"
      border="1px"
      borderColor={useColorModeValue('gray.200', 'gray.600')}
    >
      {/* Image Container */}
      <Box
        position="relative"
        height={imageHeight}
        overflow="hidden"
      >
        <AnimatePresence mode="wait">
          <MotionBox
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
          >
            <LazyImage
              src={rescueImages[currentImageIndex]}
              alt={`Animal rescue image ${currentImageIndex + 1}`}
              height="100%"
              width="100%"
              effect="fade"
              sx={{ objectFit: 'cover' }}
            />
          </MotionBox>
        </AnimatePresence>

        {/* Overlay Content */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={overlayBg}
          display="flex"
          alignItems="center"
          justifyContent="center"
          opacity={0}
          transition="opacity 0.3s ease"
          _hover={{ opacity: 1 }}
        >
          <VStack spacing={6} textAlign="center" px={6}>
            <ScaleFade in={true}>
              <Text
                fontSize={fontSize}
                fontWeight="bold"
                color={textColor}
                textShadow="2px 2px 4px rgba(0,0,0,0.5)"
                lineHeight="shorter"
              >
                {captions[currentImageIndex]}
              </Text>
            </ScaleFade>
            
            <Fade in={true}>
              <Button
                size={buttonSize}
                colorScheme="teal"
                variant="solid"
                onClick={scrollToPayment}
                fontWeight="bold"
                px={8}
                py={6}
                borderRadius="full"
                shadow="lg"
                _hover={{
                  transform: 'translateY(-2px)',
                  shadow: 'xl',
                  bg: 'teal.600'
                }}
                _active={{
                  transform: 'translateY(0)',
                  shadow: 'md'
                }}
                transition="all 0.2s"
              >
                💖 Donation Now !!!
              </Button>
            </Fade>
          </VStack>
        </Box>

        {/* Navigation Arrows */}
        {rescueImages.length > 1 && (
          <>
            <IconButton
              icon={<ChevronLeftIcon />}
              position="absolute"
              left={4}
              top="50%"
              transform="translateY(-50%)"
              onClick={prevImage}
              colorScheme="whiteAlpha"
              variant="solid"
              size="lg"
              borderRadius="full"
              opacity={0.8}
              _hover={{ opacity: 1, transform: 'translateY(-50%) scale(1.1)' }}
              transition="all 0.2s"
              aria-label="Previous image"
            />
            <IconButton
              icon={<ChevronRightIcon />}
              position="absolute"
              right={4}
              top="50%"
              transform="translateY(-50%)"
              onClick={nextImage}
              colorScheme="whiteAlpha"
              variant="solid"
              size="lg"
              borderRadius="full"
              opacity={0.8}
              _hover={{ opacity: 1, transform: 'translateY(-50%) scale(1.1)' }}
              transition="all 0.2s"
              aria-label="Next image"
            />
          </>
        )}

        {/* Image Indicators */}
        {rescueImages.length > 1 && (
          <HStack
            position="absolute"
            bottom={4}
            left="50%"
            transform="translateX(-50%)"
            spacing={2}
          >
            {rescueImages.map((_, index) => (
              <Box
                key={index}
                w={3}
                h={3}
                borderRadius="full"
                bg={index === currentImageIndex ? 'white' : 'whiteAlpha.500'}
                cursor="pointer"
                onClick={() => setCurrentImageIndex(index)}
                transition="all 0.2s"
                _hover={{ 
                  bg: 'white',
                  transform: 'scale(1.2)'
                }}
              />
            ))}
          </HStack>
        )}
      </Box>

      {/* Quote Section */}
      <Box
        p={6}
        textAlign="center"
        bgGradient={useColorModeValue(
          'linear(to-r, teal.50, blue.50)',
          'linear(to-r, teal.800, blue.800)'
        )}
      >
        <Text
          fontSize={{ base: 'md', md: 'lg' }}
          fontWeight="medium"
          color={useColorModeValue('gray.700', 'gray.200')}
          lineHeight="tall"
        >
          <Text as="span" color="teal.500" fontWeight="bold">
            Mỗi đóng góp
          </Text>
          {' '}của bạn là một{' '}
          <Text as="span" color="blue.500" fontWeight="bold">
            cơ hội sống mới
          </Text>
          {' '}cho những người bạn bốn chân 🐕🐈
        </Text>
      </Box>
    </Box>
  );
};

export default AnimalShowcase;