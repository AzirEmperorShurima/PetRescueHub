import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Avatar,
  Button,
  Tabs,
  Tab,
  Divider,
  TextField,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import authService from '../../services/auth.service';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    // Cuộn lên đầu trang khi component được mount
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Lấy thông tin người dùng
    const currentUser = authService.getUserSession();
    if (!currentUser) {
      navigate('/auth/login'); // Sửa đường dẫn từ /login thành /auth/login
      return;
    }
    
    setUser(currentUser);
    setFormData({
      name: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      bio: currentUser.bio || ''
    });
  }, [navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (!editMode) {
      // Khi bắt đầu chỉnh sửa, cập nhật formData từ user
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSaveProfile = () => {
    // Giả lập cập nhật thông tin
    const updatedUser = {
      ...user,
      name: formData.name,
      phone: formData.phone,
      bio: formData.bio
    };
    
    // Cập nhật thông tin người dùng trong localStorage
    authService.setUserSession(updatedUser, localStorage.getItem('token'));
    setUser(updatedUser);
    
    // Hiển thị thông báo thành công
    setSnackbar({
      open: true,
      message: 'Cập nhật thông tin thành công',
      severity: 'success'
    });
    
    // Tắt chế độ chỉnh sửa
    setEditMode(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="profile-container">
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper className="profile-sidebar">
            <Box className="profile-avatar-container">
              <Avatar 
                src={user.avatar} 
                alt={user.name}
                className="profile-avatar"
              />
              <Typography variant="h5" className="profile-name">
                {user.name}
              </Typography>
              <Typography variant="body2" className="profile-email">
                {user.email}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box className="profile-stats">
              <Box className="stat-item">
                <Typography variant="h6">5</Typography>
                <Typography variant="body2">Thú cưng</Typography>
              </Box>
              <Box className="stat-item">
                <Typography variant="h6">12</Typography>
                <Typography variant="body2">Bài viết</Typography>
              </Box>
              <Box className="stat-item">
                <Typography variant="h6">3</Typography>
                <Typography variant="body2">Sự kiện</Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box className="profile-actions">
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                startIcon={editMode ? <CancelIcon /> : <EditIcon />}
                onClick={handleEditToggle}
                sx={{ mb: 1 }}
              >
                {editMode ? 'Hủy chỉnh sửa' : 'Chỉnh sửa hồ sơ'}
              </Button>
              
              {editMode && (
                <Button 
                  variant="contained" 
                  color="success" 
                  fullWidth
                  startIcon={<SaveIcon />}
                  onClick={handleSaveProfile}
                >
                  Lưu thay đổi
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper className="profile-content">
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Thông tin cá nhân" />
                <Tab label="Thú cưng của tôi" />
                <Tab label="Hoạt động" />
                <Tab label="Cài đặt" />
              </Tabs>
            </Box>
            
            {/* Tab Thông tin cá nhân */}
            {tabValue === 0 && (
              <Box className="profile-tab-content">
                <Typography variant="h6" gutterBottom>
                  Thông tin cá nhân
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Họ và tên"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                      disabled={!editMode}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email"
                      name="email"
                      value={formData.email}
                      fullWidth
                      margin="normal"
                      disabled={true} // Email không được phép thay đổi
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Số điện thoại"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                      disabled={!editMode}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label="Giới thiệu bản thân"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                      multiline
                      rows={4}
                      disabled={!editMode}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            
            {/* Tab Thú cưng của tôi */}
            {tabValue === 1 && (
              <Box className="profile-tab-content">
                <Typography variant="h6" gutterBottom>
                  Thú cưng của tôi
                </Typography>
                <Typography variant="body1">
                  Danh sách thú cưng của bạn sẽ hiển thị ở đây.
                </Typography>
              </Box>
            )}
            
            {/* Tab Hoạt động */}
            {tabValue === 2 && (
              <Box className="profile-tab-content">
                <Typography variant="h6" gutterBottom>
                  Hoạt động gần đây
                </Typography>
                <Typography variant="body1">
                  Các hoạt động gần đây của bạn sẽ hiển thị ở đây.
                </Typography>
              </Box>
            )}
            
            {/* Tab Cài đặt */}
            {tabValue === 3 && (
              <Box className="profile-tab-content">
                <Typography variant="h6" gutterBottom>
                  Cài đặt tài khoản
                </Typography>
                <Typography variant="body1">
                  Các cài đặt tài khoản sẽ hiển thị ở đây.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;