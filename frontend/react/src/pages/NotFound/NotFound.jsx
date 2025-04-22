import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import './NotFound.css';

const NotFound = () => {
  return (
    <Container maxWidth="md" className="not-found-container">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
          py: 5,
        }}
      >
        <PetsIcon sx={{ fontSize: 100, color: 'primary.main', mb: 2 }} />
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Không tìm thấy trang
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
          Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="primary"
            size="large"
          >
            Về trang chủ
          </Button>
          <Button
            component={Link}
            to="/forum"
            variant="outlined"
            color="primary"
            size="large"
          >
            Khám phá diễn đàn
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFound;