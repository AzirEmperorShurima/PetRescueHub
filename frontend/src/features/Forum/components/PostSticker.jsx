import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const PostSticker = ({ type }) => {
  const getTypeStyle = () => {
    const styleMap = {
      question: {
        bg: 'orange.400',
        color: 'white'
      },
      eventpost: {
        bg: 'green.400',
        color: 'white'
      },
      post: {
        bg: 'blue.400',
        color: 'white'
      },
      findlostpetpost: {
        bg: 'red.500', // màu nổi bật
        color: 'white',
        border: '2px solid',
        borderColor: 'red.700',
        boxShadow: '0 0 10px red' // hiệu ứng bắt mắt
      }
    };
  
    return styleMap[type?.toLowerCase()] || styleMap['post'];
  };
  
  const getTypeLabel = () => {
    const typeMap = {
      question: 'Câu hỏi',
      eventpost: 'Sự kiện',
      post: 'Bài viết',
      findlostpetpost: 'Tìm thú đi lạc'
    };
  
    return typeMap[type?.toLowerCase()] || 'Bài viết';
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