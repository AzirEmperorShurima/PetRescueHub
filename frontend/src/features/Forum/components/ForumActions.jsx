import React, { useCallback } from 'react';
import { VStack, Button, useToast } from '@chakra-ui/react';
import { AddIcon, QuestionIcon } from '@chakra-ui/icons';
import { CalendarIcon } from '@chakra-ui/icons';

// Custom Pet Icon component (since Chakra doesn't have a pets icon)
const PetsIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="M4.5 12.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm3-4c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm5.5 0c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm3 4c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm-5.5 3c.83 0 1.5.67 1.5 1.5 0 1.66-1.34 3-3 3s-3-1.34-3-3c0-.83.67-1.5 1.5-1.5h3z"/>
  </svg>
);

const ForumActions = ({ 
  isAuthenticated, 
  onCreatePost, 
  onCreateQuestion, 
  onCreateEvent, 
  onFindLostPet,
  postType 
}) => {
  const toast = useToast();

  // Toast configuration for unauthenticated users
  const showAuthToast = (message) => {
    toast({
      title: 'Yêu cầu đăng nhập',
      description: message,
      status: 'warning',
      duration: 3000,
      isClosable: true,
      position: 'top'
    });
  };

  // Sử dụng useCallback để tối ưu các hàm xử lý sự kiện
  const handleCreatePost = useCallback(() => {
    if (isAuthenticated) {
      onCreatePost();
    } else {
      showAuthToast('Vui lòng đăng nhập để tạo bài viết mới');
    }
  }, [isAuthenticated, onCreatePost]);

  const handleCreateQuestion = useCallback(() => {
    if (isAuthenticated) {
      onCreateQuestion();
    } else {
      showAuthToast('Vui lòng đăng nhập để đặt câu hỏi mới');
    }
  }, [isAuthenticated, onCreateQuestion]);

  const handleCreateEvent = useCallback(() => {
    if (isAuthenticated) {
      onCreateEvent();
    } else {
      showAuthToast('Vui lòng đăng nhập để tạo sự kiện mới');
    }
  }, [isAuthenticated, onCreateEvent]);

  const handleFindLostPet = useCallback(() => {
    if (isAuthenticated) {
      onFindLostPet();
    } else {
      showAuthToast('Vui lòng đăng nhập để đăng tin tìm thú cưng');
    }
  }, [isAuthenticated, onFindLostPet]);

  return (
    <VStack spacing={3} className="forum-create-buttons" w="full">
      <Button
        variant="outline"
        colorScheme="pink"
        leftIcon={<AddIcon />}
        onClick={handleCreatePost}
        w="full"
        size="sm"
        _hover={{
          bg: 'blue.50',
          borderColor: 'blue.300'
        }}
      >
        Tạo bài viết
      </Button>
      
      <Button
        variant="outline"
        colorScheme="pink"
        leftIcon={<QuestionIcon />}
        onClick={handleCreateQuestion}
        w="full"
        size="sm"
        _hover={{
          bg: 'blue.50',
          borderColor: 'blue.300'
        }}
      >
        Đặt câu hỏi
      </Button>
      
      <Button
        variant="outline"
        colorScheme="pink"
        leftIcon={<CalendarIcon />}
        onClick={handleCreateEvent}
        w="full"
        size="sm"
        _hover={{
          bg: 'blue.50',
          borderColor: 'blue.300'
        }}
      >
        Tạo sự kiện
      </Button>
      
      <Button
        variant="outline"
        colorScheme="pink"
        leftIcon={<PetsIcon  /> }
        onClick={handleFindLostPet}
        w="full"
        size="sm"
        _hover={{
          bg: 'blue.50',
          borderColor: 'blue.300'
        }}
      >
        Tìm thú đi lạc
      </Button>
    </VStack>
  );
};

export default ForumActions;