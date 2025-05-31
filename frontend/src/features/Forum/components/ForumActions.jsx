import React, { useCallback } from 'react';
import { VStack, Button, useToast } from '@chakra-ui/react';
import { AddIcon, QuestionIcon, CalendarIcon } from '@chakra-ui/icons';
import { useAuth } from '../../../components/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Custom Pet Icon component
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
  onCreatePost // Chỉ cần một callback duy nhất
}) => {
  const { user } = useAuth(); // Sử dụng trực tiếp useAuth hook
  const toast = useToast();
  const navigate = useNavigate();

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

  // Generic handler for all post types
  const handleCreatePost = useCallback((postType, message) => {
    if (user) { // Kiểm tra user thay vì isAuthenticated
      onCreatePost(postType);
    } else {
      showAuthToast(message);
    }
  }, [user, onCreatePost]); // Cập nhật dependencies

  // Specific handlers for each post type
  const handleCreateForumPost = useCallback(() => {
    handleCreatePost('ForumPost', 'Vui lòng đăng nhập để tạo bài viết mới');
  }, [handleCreatePost]);

  const handleCreateQuestion = useCallback(() => {
    handleCreatePost('Question', 'Vui lòng đăng nhập để đặt câu hỏi mới');
  }, [handleCreatePost]);

  const handleFindLostPet = useCallback(() => {
    handleCreatePost('FindLostPetPost', 'Vui lòng đăng nhập để đăng tin tìm thú cưng');
  }, [handleCreatePost]);

  const handleCreateEvent = () => {
    navigate('/event/create');
  };

  return (
    <VStack spacing={3} className="forum-create-buttons" w="full">
      <Button
        variant="outline"
        colorScheme="pink"
        leftIcon={<AddIcon />}
        onClick={handleCreateForumPost}
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
          bg: 'orange.50',
          borderColor: 'orange.300'
        }}
      >
        Đặt câu hỏi
      </Button>
      
      <Button
        variant="outline"
        colorScheme="pink"
        leftIcon={<PetsIcon />}
        onClick={handleFindLostPet}
        w="full"
        size="sm"
        _hover={{
          bg: 'red.50',
          borderColor: 'red.300'
        }}
      >
        Tìm thú đi lạc
      </Button>

      <Button
        variant="outline"
        colorScheme="pink"
        leftIcon={<CalendarIcon />}
        onClick={handleCreateEvent}
        w="full"
        size="sm"
        _hover={{
          bg: 'green.50',
          borderColor: 'green.300'
        }}
      >
        Tạo sự kiện
      </Button>
    </VStack>
  );
};

export default ForumActions;