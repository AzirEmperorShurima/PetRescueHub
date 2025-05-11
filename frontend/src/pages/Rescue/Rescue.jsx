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
  Checkbox,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Divider,
  Avatar
} from '@mui/material';
import { 
  LocationOn as LocationIcon,
  MyLocation as MyLocationIcon,
  Send as SendIcon,
  Pets as PetsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/contexts/AuthContext';
import axios from 'axios';
import './Rescue.css';
import rescueService from '../../services/rescue.service';

const Rescue = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [volunteers, setVolunteers] = useState([]);
  const [loadingVolunteers, setLoadingVolunteers] = useState(false);
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
    petDetails: '', // Thêm trường mô tả chi tiết về thú cưng
    radius: 1, // Bán kính mặc định 1km
    location: {
      type: 'Point',
      coordinates: [0, 0] // [longitude, latitude]
    },
    isGuest: !user?.id,
    status: 'pending',
    autoAssignVolunteer: true, // Mặc định tự động chọn tình nguyện viên
    selectedVolunteers: [] // Danh sách tình nguyện viên được chọn
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
        
        // Tìm tình nguyện viên gần đó khi có vị trí
        if (longitude !== 0 && latitude !== 0) {
          findNearbyVolunteers(longitude, latitude, formData.radius);
        }
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

  // Tìm tình nguyện viên gần đó
  const findNearbyVolunteers = async (longitude, latitude, radius) => {
    setLoadingVolunteers(true);
    try {
      // Gọi API để tìm tình nguyện viên gần đó
      const response = await axios.get('/api/volunteers/nearby', {
        params: {
          longitude,
          latitude,
          radius
        }
      });
      
      setVolunteers(response.data.volunteers || []);
    } catch (error) {
      console.error('Lỗi khi tìm tình nguyện viên:', error);
      setSnackbar({
        open: true,
        message: 'Không thể tìm tình nguyện viên gần đó',
        severity: 'warning'
      });
    } finally {
      setLoadingVolunteers(false);
    }
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
    
    // Cập nhật danh sách tình nguyện viên khi thay đổi bán kính
    if (formData.location.coordinates[0] !== 0 && formData.location.coordinates[1] !== 0) {
      findNearbyVolunteers(
        formData.location.coordinates[0],
        formData.location.coordinates[1],
        newValue
      );
    }
  };

  // Xử lý thay đổi checkbox tự động chọn tình nguyện viên
  const handleAutoAssignChange = (e) => {
    setFormData({
      ...formData,
      autoAssignVolunteer: e.target.checked
    });
  };

  // Xử lý chọn tình nguyện viên
  const handleVolunteerSelection = (volunteerId) => {
    const selectedVolunteers = [...formData.selectedVolunteers];
    const index = selectedVolunteers.indexOf(volunteerId);
    
    if (index === -1) {
      selectedVolunteers.push(volunteerId);
    } else {
      selectedVolunteers.splice(index, 1);
    }
    
    setFormData({
      ...formData,
      selectedVolunteers
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

    // Kiểm tra nếu không tự động chọn tình nguyện viên thì phải chọn ít nhất 1
    if (!formData.autoAssignVolunteer && formData.selectedVolunteers.length === 0) {
      setSnackbar({
        open: true,
        message: 'Vui lòng chọn ít nhất một tình nguyện viên',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      // Chuẩn bị dữ liệu gửi đi
      const rescueData = {
        requester: user?.id || null,
        guestInfo: formData.isGuest ? {
          fullname: formData.fullname,
          phone: formData.phone
        } : null,
        location: formData.location,
        radius: formData.radius,
        notes: formData.notes,
        petDetails: formData.petDetails,
        missionId: `RESCUE-${Date.now()}`,
        status: 'pending',
        startedAt: new Date(),
        autoAssign: formData.autoAssignVolunteer,
        selectedVolunteers: formData.autoAssignVolunteer ? [] : formData.selectedVolunteers
      };

      // Gọi API để tạo báo cáo cứu hộ
      const response = await rescueService.createRescueMission(rescueData);
      
      setSnackbar({
        open: true,
        message: 'Báo cáo cứu hộ đã được gửi thành công!',
        severity: 'success'
      });
      
      // Chuyển hướng sau khi gửi thành công
      setTimeout(() => {
        navigate('/rescue/success', { state: { missionId: response.missionId } });
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
                  max={5} // max 5km 
                  disabled={loading}
                />
                <Typography variant="body2" color="textSecondary" textAlign="center">
                  {formData.radius} km
                </Typography>
              </Box>
            </Grid>

            {/* Thông tin thú cưng cần cứu hộ */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <PetsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Thông tin thú cưng cần cứu hộ
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Mô tả chi tiết về thú cưng cần cứu hộ"
                name="petDetails"
                value={formData.petDetails}
                onChange={handleInputChange}
                placeholder="Ví dụ: Loại thú cưng, màu lông, kích thước, đặc điểm nhận dạng..."
                disabled={loading}
              />
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

            {/* Tùy chọn tình nguyện viên */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Tùy chọn tình nguyện viên
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.autoAssignVolunteer}
                    onChange={handleAutoAssignChange}
                    name="autoAssignVolunteer"
                    color="primary"
                    disabled={loading}
                  />
                }
                label="Tự động chọn tình nguyện viên gần nhất"
              />

              {!formData.autoAssignVolunteer && volunteers.length > 0 && (
                <Box mt={2} className="volunteer-selection">
                  <Typography variant="subtitle1" gutterBottom>
                    Chọn tình nguyện viên (tối thiểu 1 người):
                  </Typography>
                  <Grid container spacing={2}>
                    {volunteers.map((volunteer) => (
                      <Grid item xs={12} sm={6} key={volunteer._id}>
                        <Paper 
                          className={`volunteer-card ${formData.selectedVolunteers.includes(volunteer._id) ? 'selected' : ''}`}
                          onClick={() => handleVolunteerSelection(volunteer._id)}
                          sx={{ 
                            p: 2, 
                            cursor: 'pointer',
                            border: formData.selectedVolunteers.includes(volunteer._id) ? '2px solid #1976d2' : '1px solid #e0e0e0'
                          }}
                        >
                          <Box display="flex" alignItems="center">
                            <Avatar src={volunteer.avatar} alt={volunteer.fullname}>
                              {volunteer.fullname.charAt(0)}
                            </Avatar>
                            <Box ml={2}>
                              <Typography variant="subtitle1">{volunteer.fullname}</Typography>
                              <Typography variant="body2" color="textSecondary">
                                Khoảng cách: {(volunteer.distance / 1000).toFixed(2)} km
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {!formData.autoAssignVolunteer && volunteers.length === 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Không tìm thấy tình nguyện viên trong khu vực. Vui lòng tăng bán kính tìm kiếm hoặc chọn tự động gán.
                </Alert>
              )}
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