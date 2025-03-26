import React from 'react';
import { IconButton, Typography, Box } from '@mui/material';
import { Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';

const LikeButton = ({ liked, likeCount, onLike, size = 'medium', showCount = true, color = 'primary' }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton 
        onClick={onLike} 
        color={liked ? color : 'default'}
        size={size}
      >
        {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
      {showCount && (
        <Typography variant="body2" color="text.secondary">
          {likeCount}
        </Typography>
      )}
    </Box>
  );
};

LikeButton.propTypes = {
  liked: PropTypes.bool.isRequired,
  likeCount: PropTypes.number.isRequired,
  onLike: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  showCount: PropTypes.bool,
  color: PropTypes.string
};

export default LikeButton;