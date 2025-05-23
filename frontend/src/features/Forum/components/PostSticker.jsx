import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const PostSticker = ({ type }) => {
  const getTypeStyle = () => {
    switch (type) {
      case 'Question':
      case 'question':
        return {
          bg: 'orange.400',
          color: 'white'
        };
      case 'EventPost':
      case 'event':
        return {
          bg: 'green.400',
          color: 'white'
        };
      case 'ForumPost':
      case 'post':
      default:
        return {
          bg: 'blue.400',
          color: 'white'
        };
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'Question':
      case 'question':
        return 'Câu hỏi';
      case 'EventPost':
      case 'event':
        return 'Sự kiện';
      case 'ForumPost':
      case 'post':
      default:
        return 'Bài viết';
    }
  };

  return (
    <Box
      position="absolute"
      top={2.5}
      right={2.5}
      px={3}
      py={1}
      borderRadius="md"
      fontSize="xs"
      fontWeight="bold"
      zIndex={1}
      shadow="sm"
      {...getTypeStyle()}
    >
      <Text fontSize="xs" fontWeight="bold">
        {getTypeLabel()}
      </Text>
    </Box>
  );
};

export default PostSticker;