import React from 'react';
import { Box, Typography } from '@mui/material';

const PostSticker = ({ type }) => {
  const getTypeStyle = () => {
    switch (type) {
      case 'Question':
        return {
          backgroundColor: '#FF9800',
          color: '#fff'
        };
      case 'EventPost':
        return {
          backgroundColor: '#4CAF50',
          color: '#fff'
        };
      case 'ForumPost':
      default:
        return {
          backgroundColor: '#2196F3',
          color: '#fff'
        };
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'Question':
        return 'Câu hỏi';
      case 'EventPost':
        return 'Sự kiện';
      case 'ForumPost':
      default:
        return 'Bài viết';
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 10,
        right: 10,
        padding: '4px 12px',
        borderRadius: '4px',
        ...getTypeStyle(),
      }}
    >
      <Typography variant="caption" fontWeight="bold">
        {getTypeLabel()}
      </Typography>
    </Box>
  );
};

export default PostSticker;