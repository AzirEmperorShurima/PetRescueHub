import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Skeleton, 
  useColorModeValue,
  Spinner,
  Center,
  Fade
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

// Motion wrapper for Box
const MotionBox = motion(Box);

const LazyImage = ({ 
  src, 
  alt, 
  width = '100%', 
  height = 'auto', 
  sx = {}, 
  threshold = 0.1,
  effect = 'fade', // 'blur', 'fade', 'scale', 'none'
  showSpinner = false,
  borderRadius = 'md',
  objectFit = 'cover',
  objectPosition = 'center',
  fallbackSrc,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const imgRef = useRef(null);

  // Theme colors
  const skeletonStartColor = useColorModeValue('gray.100', 'gray.700');
  const skeletonEndColor = useColorModeValue('gray.300', 'gray.600');
  const spinnerColor = useColorModeValue('teal.500', 'teal.200');

  // Intersection Observer để lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setIsLoading(true);
          observer.disconnect();
        }
      },
      { 
        threshold,
        rootMargin: '50px' // Load trước khi vào viewport 50px
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  // Xử lý khi ảnh load thành công
  const handleImageLoaded = (e) => {
    setIsLoaded(true);
    setIsLoading(false);
    onLoad?.(e);
  };

  // Xử lý khi ảnh load thất bại
  const handleImageError = (e) => {
    setHasError(true);
    setIsLoading(false);
    onError?.(e);
  };

  // Animation variants cho các hiệu ứng
  const getAnimationVariants = () => {
    switch (effect) {
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { duration: 0.6, ease: "easeOut" }
          }
        };
      case 'blur':
        return {
          hidden: { 
            opacity: 0, 
            filter: 'blur(20px)' 
          },
          visible: { 
            opacity: 1, 
            filter: 'blur(0px)',
            transition: { duration: 0.8, ease: "easeOut" }
          }
        };
      case 'scale':
        return {
          hidden: { 
            opacity: 0, 
            scale: 1.1 
          },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.6, ease: "easeOut" }
          }
        };
      default:
        return {
          hidden: { opacity: 1 },
          visible: { opacity: 1 }
        };
    }
  };

  const variants = getAnimationVariants();

  return (
    <Box
      ref={imgRef}
      position="relative"
      width={width}
      height={height}
      borderRadius={borderRadius}
      overflow="hidden"
      bg={useColorModeValue('gray.100', 'gray.700')}
      {...sx}
    >
      {/* Loading Skeleton */}
      {!isLoaded && !hasError && (
        <Skeleton
          width="100%"
          height="100%"
          startColor={skeletonStartColor}
          endColor={skeletonEndColor}
          borderRadius={borderRadius}
          position="absolute"
          top={0}
          left={0}
        />
      )}

      {/* Loading Spinner */}
      {isLoading && showSpinner && !isLoaded && !hasError && (
        <Center
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={2}
        >
          <Spinner
            size="lg"
            color={spinnerColor}
            thickness="3px"
          />
        </Center>
      )}

      {/* Main Image */}
      {isInView && !hasError && (
        <MotionBox
          as="img"
          src={src}
          alt={alt}
          width="100%"
          height="100%"
          objectFit={objectFit}
          objectPosition={objectPosition}
          onLoad={handleImageLoaded}
          onError={handleImageError}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={variants}
          position="absolute"
          top={0}
          left={0}
        />
      )}

      {/* Fallback Image */}
      {hasError && fallbackSrc && (
        <Fade in={hasError}>
          <Box
            as="img"
            src={fallbackSrc}
            alt={`${alt} - fallback`}
            width="100%"
            height="100%"
            objectFit={objectFit}
            objectPosition={objectPosition}
            position="absolute"
            top={0}
            left={0}
            opacity={0.7}
          />
        </Fade>
      )}

      {/* Error State */}
      {hasError && !fallbackSrc && (
        <Center
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={useColorModeValue('gray.100', 'gray.700')}
          color={useColorModeValue('gray.500', 'gray.400')}
          fontSize="sm"
          textAlign="center"
          p={4}
        >
          <Box>
            <Box fontSize="2xl" mb={2}>🖼️</Box>
            <Box>Không thể tải ảnh</Box>
          </Box>
        </Center>
      )}

      {/* Hover Overlay Effect */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.200"
        opacity={0}
        transition="opacity 0.3s ease"
        _hover={{ opacity: 1 }}
        pointerEvents="none"
      />
    </Box>
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  sx: PropTypes.object,
  threshold: PropTypes.number,
  effect: PropTypes.oneOf(['blur', 'fade', 'scale', 'none']),
  showSpinner: PropTypes.bool,
  borderRadius: PropTypes.string,
  objectFit: PropTypes.string,
  objectPosition: PropTypes.string,
  fallbackSrc: PropTypes.string,
  onLoad: PropTypes.func,
  onError: PropTypes.func
};

export default LazyImage;