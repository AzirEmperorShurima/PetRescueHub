import React, { useState, useEffect, useRef } from 'react';
import { Box, Skeleton } from '@mui/material';
import PropTypes from 'prop-types';

const LazyImage = ({ 
  src, 
  alt, 
  width = '100%', 
  height = 'auto', 
  sx = {}, 
  placeholderColor = '#f0f0f0',
  threshold = 0.1,
  effect = 'blur' // 'blur', 'fade', 'none'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  // Sử dụng Intersection Observer để kiểm tra khi nào hình ảnh nằm trong viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  // Xử lý sự kiện khi hình ảnh tải xong
  const handleImageLoaded = () => {
    setIsLoaded(true);
  };

  // Hiệu ứng cho hình ảnh
  const getEffectStyles = () => {
    if (!isLoaded) {
      return {};
    }

    switch (effect) {
      case 'blur':
        return {
          filter: 'blur(0)',
          transition: 'filter 0.3s ease-out'
        };
      case 'fade':
        return {
          opacity: 1,
          transition: 'opacity 0.3s ease-out'
        };
      default:
        return {};
    }
  };

  return (
    <Box
      ref={imgRef}
      sx={{
        position: 'relative',
        width,
        height,
        backgroundColor: placeholderColor,
        overflow: 'hidden',
        ...sx
      }}
    >
      {!isLoaded && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
        />
      )}
      
      {isInView && (
        <Box
          component="img"
          src={src}
          alt={alt}
          onLoad={handleImageLoaded}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            ...(effect === 'blur' && { filter: 'blur(10px)' }),
            ...(effect === 'fade' && { opacity: 0 }),
            ...getEffectStyles(),
          }}
        />
      )}
    </Box>
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  sx: PropTypes.object,
  placeholderColor: PropTypes.string,
  threshold: PropTypes.number,
  effect: PropTypes.oneOf(['blur', 'fade', 'none'])
};

export default LazyImage;