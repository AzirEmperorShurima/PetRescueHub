import React, { useState, useEffect } from 'react';
import { Box, IconButton, Icon, useColorModeValue } from '@chakra-ui/react';
import { BiArrowToTop } from 'react-icons/bi';
import { motion, AnimatePresence } from 'framer-motion';

// Motion component
const MotionBox = motion(Box);

const ScrollToTopButton = ({ 
  threshold = 400, 
  position = { bottom: 120, right: 6 },
  colorScheme = 'gray',
  size = 'lg',
  zIndex = 1000
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Theo dõi vị trí scroll để hiển thị/ẩn nút
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowScrollTop(scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  // Hàm scroll lên đầu trang
  const scrollToTop = () => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      // Fallback cho trình duyệt không hỗ trợ smooth scrolling
      window.scrollTo(0, 0);
    }
  };

  // Màu nền cho button
  const buttonBg = useColorModeValue(`${colorScheme}.500`, `${colorScheme}.200`);
  const buttonHoverBg = useColorModeValue(`${colorScheme}.600`, `${colorScheme}.300`);

  return (
    <AnimatePresence>
      {showScrollTop && (
        <MotionBox
          position="fixed"
          bottom={position.bottom}
          right={position.right}
          zIndex={zIndex}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <IconButton
            icon={<Icon as={BiArrowToTop} />}
            colorScheme={colorScheme}
            size={size}
            borderRadius="full"
            shadow="lg"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            _hover={{ bg: buttonHoverBg }}
          />
        </MotionBox>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;