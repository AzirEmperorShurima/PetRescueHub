import React, { useState } from 'react';
import { Box, TextField, Button, Avatar } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';

const CommentForm = ({ onSubmit, placeholder = 'Viết bình luận...', buttonText = 'Gửi', userAvatar }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit(comment);
      setComment('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
      {userAvatar && (
        <Avatar 
          src={userAvatar} 
          alt="User Avatar" 
          sx={{ mr: 1, width: 36, height: 36 }} 
        />
      )}
      <TextField
        fullWidth
        multiline
        minRows={1}
        maxRows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={placeholder}
        variant="outlined"
        size="small"
        sx={{ mr: 1 }}
      />
      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        disabled={!comment.trim()}
        endIcon={<SendIcon />}
        size="medium"
      >
        {buttonText}
      </Button>
    </Box>
  );
};

CommentForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  buttonText: PropTypes.string,
  userAvatar: PropTypes.string
};

export default CommentForm;