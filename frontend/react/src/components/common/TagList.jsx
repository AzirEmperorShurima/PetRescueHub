import React from 'react';
import { Box, Chip } from '@mui/material';
import PropTypes from 'prop-types';

const TagList = ({ tags, onClick, sx = {} }) => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, ...sx }}>
      {tags.map((tag, index) => (
        <Chip
          key={index}
          label={tag}
          size="small"
          onClick={onClick ? () => onClick(tag) : undefined}
          clickable={Boolean(onClick)}
        />
      ))}
    </Box>
  );
};

TagList.propTypes = {
  tags: PropTypes.array.isRequired,
  onClick: PropTypes.func,
  sx: PropTypes.object
};

export default TagList;