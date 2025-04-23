import React from 'react';
import { Container, Typography, Paper, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CreateQuestion = () => {
  const navigate = useNavigate();
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Đặt câu hỏi mới
        </Typography>
        <Typography variant="body1" gutterBottom>
          Trang đang được phát triển...
        </Typography>
        <Box mt={2}>
          <Button variant="contained" onClick={() => navigate('/forum')}>
            Quay lại diễn đàn
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateQuestion;