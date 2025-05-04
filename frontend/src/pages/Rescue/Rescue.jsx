import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  Slider, 
  CircularProgress,
  Alert,
  Snackbar,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { 
  LocationOn as LocationIcon,
  MyLocation as MyLocationIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/contexts/AuthContext';
import axios from 'axios';
import './Rescue.css';

const Rescue = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Form state
  const [formData, setFormData] = useState({
    fullname: user?.fullname || '',
    phone: user?.phone || '',
    notes: '',
    radius: 1, // Bán kính mặc định 5km
    location: {
      type: 'Point',
      coordinates: [0, 0] // [longitude, latitude]
    },
    isGuest: !user?.id
  });

  // Lấy vị trí hiện tại của người dùng
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setSnackbar({
        open: true,
        message: 'Trình duyệt của bạn không hỗ trợ định vị',
        severity: 'error'
      });
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setFormData({
          ...formData,
          location: {
            type: 'Point',
            coordinates: [longitude, latitude]
          }
        });
        setLocationLoading(false);
        setSnackbar({
          open: true,
          message: 'Đã lấy vị trí hiện tại thành công',
          severity: 'success'
        });
      },
      (error) => {
        console.error('Lỗi khi lấy vị trí:', error);
        setLocationLoading(false);
        setSnackbar({
          open: true,
          message: 'Không thể lấy vị trí hiện tại. Vui lòng thử lại.',
          severity: 'error'
        });
      }
    );
  };

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Xử lý thay đổi bán kính
  const handleRadiusChange = (event, newValue) => {
    setFormData({
      ...formData,
      radius: newValue
    });
  };

  // Xử lý gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra vị trí
    if (formData.location.coordinates[0] === 0 && formData.location.coordinates[1] === 0) {
      setSnackbar({
        open: true,
        message: 'Vui lòng lấy vị trí hiện tại trước khi gửi báo cáo',
        severity: 'error'
      });
      return;
    }

    // Kiểm tra thông tin người dùng
    if (formData.isGuest && (!formData.fullname || !formData.phone)) {
      setSnackbar({
        open: true,
        message: 'Vui lòng nhập đầy đủ họ tên và số điện thoại',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      // Chuẩn bị dữ liệu gửi đi
      const rescueData = {
        ...formData,
        requester: user?.id || null,
        guestInfo: formData.isGuest ? {
          fullname: formData.fullname,
          phone: formData.phone
        } : null,
        missionId: `RESCUE-${Date.now()}`,
        status: 'pending'
      };

      // Gọi API để tạo báo cáo cứu hộ
      const response = await axios.post('/api/rescue-missions', rescueData);
      
      setSnackbar({
        open: true,
        message: 'Báo cáo cứu hộ đã được gửi thành công!',
        severity: 'success'
      });
      
      // Chuyển hướng sau khi gửi thành công
      setTimeout(() => {
        navigate('/rescue/success', { state: { missionId: response.data.missionId } });
      }, 2000);
    } catch (error) {
      console.error('Lỗi khi gửi báo cáo cứu hộ:', error);
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại sau.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Đóng snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Lấy vị trí khi component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <Container maxWidth="md" className="rescue-container">
      <Paper elevation={3} className="rescue-paper">
        <Box className="rescue-header">
          <Typography variant="h4" component="h1" gutterBottom>
            Báo cáo cứu hộ thú cưng
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Vui lòng cung cấp thông tin để chúng tôi có thể hỗ trợ cứu hộ
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} className="rescue-form">
          <Grid container spacing={3}>
            {/* Thông tin người báo cáo */}
            {!user?.id && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Thông tin liên hệ
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    required={formData.isGuest}
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required={formData.isGuest}
                    disabled={loading}
                  />
                </Grid>
              </>
            )}

            {/* Vị trí */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Vị trí cứu hộ
              </Typography>
              <Box className="location-box">
                <Box display="flex" alignItems="center" mb={2}>
                  <LocationIcon color="primary" />
                  <Typography variant="body1" ml={1}>
                    {formData.location.coordinates[0] !== 0 && formData.location.coordinates[1] !== 0
                      ? `Vĩ độ: ${formData.location.coordinates[1].toFixed(6)}, Kinh độ: ${formData.location.coordinates[0].toFixed(6)}`
                      : 'Chưa có vị trí'}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={locationLoading ? <CircularProgress size={20} /> : <MyLocationIcon />}
                  onClick={getCurrentLocation}
                  disabled={locationLoading || loading}
                >
                  {locationLoading ? 'Đang lấy vị trí...' : 'Lấy vị trí hiện tại'}
                </Button>
              </Box>
            </Grid>

            {/* Bán kính */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Bán kính tìm kiếm tình nguyện viên
              </Typography>
              <Box px={2}>
                <Slider
                  value={formData.radius}
                  onChange={handleRadiusChange}
                  aria-labelledby="radius-slider"
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={1}
                  max={20}
                  disabled={loading}
                />
                <Typography variant="body2" color="textSecondary" textAlign="center">
                  {formData.radius} km
                </Typography>
              </Box>
            </Grid>

            {/* Ghi chú */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Mô tả tình trạng
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Mô tả chi tiết về tình trạng thú cưng cần cứu hộ"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Ví dụ: Một chú chó bị thương ở chân, nằm bên đường, cần được cứu hộ gấp..."
                disabled={loading}
              />
            </Grid>

            {/* Nút gửi */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  disabled={loading || locationLoading}
                  className="submit-button"
                >
                  {loading ? 'Đang gửi...' : 'Gửi báo cáo cứu hộ'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Rescue;