import React from 'react';
import { Box, Button } from '@mui/material';
import { 
  Add as AddIcon, 
  Article as PostIcon, 
  QuestionAnswer as QuestionIcon, 
  Event as EventIcon 
} from '@mui/icons-material';
import PropTypes from 'prop-types';

const ForumActions = ({ onCreatePost, onCreateQuestion, onCreateEvent, displayStyle = 'horizontal' }) => {
  if (displayStyle === 'vertical') {
    return (
      <Box display="flex" flexDirection="column" gap={1}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<PostIcon />}
          fullWidth
          onClick={onCreatePost}
        >
          Tạo bài viết
        </Button>

        <Button
          variant="outlined"
          color="primary"
          startIcon={<QuestionIcon />}
          fullWidth
          onClick={onCreateQuestion}
        >
          Đặt câu hỏi
        </Button>
        
        <Button
          variant="outlined"
          color="primary"
          startIcon={<EventIcon />}
          fullWidth
          onClick={onCreateEvent}
        >
          Tạo sự kiện
        </Button>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={1} mb={3}>
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AddIcon />} 
        endIcon={<PostIcon />}
        onClick={onCreatePost}
      >
        Tạo bài viết
      </Button>
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AddIcon />} 
        endIcon={<QuestionIcon />}
        onClick={onCreateQuestion}
      >
        Đặt câu hỏi
      </Button>
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AddIcon />} 
        endIcon={<EventIcon />}
        onClick={onCreateEvent}
      >
        Tạo sự kiện
      </Button>
    </Box>
  );
};

ForumActions.propTypes = {
  onCreatePost: PropTypes.func.isRequired,
  onCreateQuestion: PropTypes.func.isRequired,
  onCreateEvent: PropTypes.func.isRequired,
  displayStyle: PropTypes.oneOf(['horizontal', 'vertical'])
};

export default ForumActions;