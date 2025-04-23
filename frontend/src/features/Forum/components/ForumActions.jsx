import React from 'react';
import { Box, Button } from '@mui/material';
import { 
  Add as AddIcon, 
  Article as PostIcon, 
  QuestionAnswer as QuestionIcon, 
  Event as EventIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ForumActions = ({ isAuthenticated, onCreatePost, onCreateQuestion, onCreateEvent, displayStyle = 'horizontal' }) => {
  const navigate = useNavigate();
  
  const handleAction = (action) => {
    if (isAuthenticated) {
      action();
    } else {
      navigate('/auth/login');
    }
  };

  if (displayStyle === 'vertical') {
    return (
      <Box display="flex" flexDirection="column" gap={1}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<PostIcon />}
          fullWidth
          onClick={() => handleAction(onCreatePost)}
        >
          Tạo bài viết
        </Button>

        <Button
          variant="outlined"
          color="primary"
          startIcon={<QuestionIcon />}
          fullWidth
          onClick={() => handleAction(onCreateQuestion)}
        >
          Đặt câu hỏi
        </Button>
        
        <Button
          variant="outlined"
          color="primary"
          startIcon={<EventIcon />}
          fullWidth
          onClick={() => handleAction(onCreateEvent)}
        >
          Tạo sự kiện
        </Button>
      </Box>
    );
  }

  return (
    <Box 
      display="flex" 
      flexDirection="column"
      gap={2}
      sx={{
        width: '100%',
        maxWidth: 180,
        '& .MuiButton-root': {
          justifyContent: 'flex-start',
          padding: '12px 20px',
          borderRadius: '10px',
          backgroundColor: 'white',
          color: '#D34F81',
          border: '1px solid #D34F81',
          '&:hover': {
            backgroundColor: '#D34F81',
            color: 'white'
          }
        }
      }}
    >
      <Button 
        variant="outlined"
        startIcon={<AddIcon />}
        endIcon={<PostIcon />}
        onClick={() => handleAction(onCreatePost)}
        fullWidth
      >
        Tạo bài viết
      </Button>
      <Button 
        variant="outlined"
        startIcon={<AddIcon />}
        endIcon={<QuestionIcon />}
        onClick={() => handleAction(onCreateQuestion)}
        fullWidth
      >
        Đặt câu hỏi
      </Button>
      <Button 
        variant="outlined"
        startIcon={<AddIcon />}
        endIcon={<EventIcon />}
        onClick={() => handleAction(onCreateEvent)}
        fullWidth
      >
        Tạo sự kiện
      </Button>
    </Box>
  );
};

ForumActions.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  onCreatePost: PropTypes.func.isRequired,
  onCreateQuestion: PropTypes.func.isRequired,
  onCreateEvent: PropTypes.func.isRequired,
  displayStyle: PropTypes.oneOf(['horizontal', 'vertical'])
};

export default ForumActions;