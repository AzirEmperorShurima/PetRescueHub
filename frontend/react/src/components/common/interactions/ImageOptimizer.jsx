import React from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';

const ImageOptimizer = ({ src, alt, width = '100%', height = 'auto', sx = {} }) => {
  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      sx={{
        width,
        height,
        objectFit: 'cover',
        borderRadius: 1,
        ...sx
      }}
      loading="lazy"
    />
  );
};

ImageOptimizer.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  sx: PropTypes.object
};

export default ImageOptimizer;
