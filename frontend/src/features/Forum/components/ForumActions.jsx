import React, { useCallback } from 'react';
import { Box, Button } from '@mui/material';
import { Add as AddIcon, QuestionAnswer as QuestionIcon, Event as EventIcon, Pets as PetsIcon } from '@mui/icons-material';

const ForumActions = ({ isAuthenticated, onCreatePost, onCreateQuestion, onCreateEvent, onFindLostPet }) => {
  // Sử dụng useCallback để tối ưu các hàm xử lý sự kiện
  const handleCreatePost = useCallback(() => {
    if (isAuthenticated) {
      onCreatePost();
    } else {
      alert('Vui lòng đăng nhập để tạo bài viết mới');
    }
  }, [isAuthenticated, onCreatePost]);

  const handleCreateQuestion = useCallback(() => {
    if (isAuthenticated) {
      onCreateQuestion();
    } else {
      alert('Vui lòng đăng nhập để đặt câu hỏi mới');
    }
  }, [isAuthenticated, onCreateQuestion]);

  const handleCreateEvent = useCallback(() => {
    if (isAuthenticated) {
      onCreateEvent();
    } else {
      alert('Vui lòng đăng nhập để tạo sự kiện mới');
    }
  }, [isAuthenticated, onCreateEvent]);

  const handleFindLostPet = useCallback(() => {
    if (isAuthenticated) {
      onFindLostPet();
    } else {
      alert('Vui lòng đăng nhập để đăng tin tìm thú cưng');
    }
  }, [isAuthenticated, onFindLostPet]);

  return (
    <Box className="forum-create-buttons">
      <Button
        variant="outlined"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleCreatePost}
        fullWidth
        sx={{ mb: 1 }}
      >
        Tạo bài viết
      </Button>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<QuestionIcon />}
        onClick={handleCreateQuestion}
        fullWidth
        sx={{ mb: 1 }}
      >
        Đặt câu hỏi
      </Button>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<EventIcon />}
        onClick={handleCreateEvent}
        fullWidth
        sx={{ mb: 1 }}
      >
        Tạo sự kiện
      </Button>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<PetsIcon />}
        onClick={handleFindLostPet}
        fullWidth
      >
        Tìm thú đi lạc
      </Button>
    </Box>
  );
};

export default ForumActions;