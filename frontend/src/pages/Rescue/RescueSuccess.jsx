import React, { useEffect } from 'react';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Home as HomeIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import './Rescue.css';

const RescueSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const missionId = location.state?.missionId || 'UNKNOWN';

  useEffect(() => {
    // Cuộn lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Container maxWidth="md" className="rescue-container">
      <Paper elevation={3} className="rescue-paper rescue-success-paper">
        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
          <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
          
          <Typography variant="h4" component="h1" gutterBottom>
            Báo cáo cứu hộ đã được gửi thành công!
          </Typography>
          
          <Typography variant="subtitle1" color="textSecondary" paragraph>
            Cảm ơn bạn đã báo cáo. Chúng tôi đã nhận được thông tin và sẽ xử lý trong thời gian sớm nhất.
          </Typography>
          
          <Box className="mission-id-box" my={3} p={2} bgcolor="rgba(0, 0, 0, 0.03)" borderRadius={1}>
            <Typography variant="body2" color="textSecondary">
              Mã báo cáo cứu hộ của bạn
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {missionId}
            </Typography>
          </Box>
          
          <Typography variant="body1" paragraph>
            Các tình nguyện viên trong khu vực sẽ được thông báo và sẽ liên hệ với bạn trong thời gian sớm nhất.
            Vui lòng giữ điện thoại luôn bật để nhận cuộc gọi từ đội cứu hộ.
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Quay về trang chủ
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RescueSuccess;