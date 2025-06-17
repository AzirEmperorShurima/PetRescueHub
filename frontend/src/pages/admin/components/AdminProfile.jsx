import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Grid,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import { Person as PersonIcon, Lock as LockIcon } from '@mui/icons-material';

const AdminProfile = () => {
  const [formData, setFormData] = useState({
    name: 'Admin',
    email: 'admin@example.com',
    phone: '0123456789',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Giả lập cập nhật thông tin thành công
    setSnackbar({
      open: true,
      message: 'Cập nhật thông tin thành công',
      severity: 'success'
    });
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    
    // Kiểm tra mật khẩu mới và xác nhận mật khẩu
    if (formData.newPassword !== formData.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'Mật khẩu mới và xác nhận mật khẩu không khớp',
        severity: 'error'
      });
      return;
    }
    
    // Giả lập cập nhật mật khẩu thành công
    setSnackbar({
      open: true,
      message: 'Cập nhật mật khẩu thành công',
      severity: 'success'
    });
    
    // Reset form
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#333', fontWeight: 600, mb: 3 }}>
          Hồ sơ quản trị viên
        </Typography>
        
        <Grid container spacing={3}>
          {/* Thông tin cá nhân */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: '#D34F81', width: 56, height: 56, mr: 2 }}>
                  <PersonIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Thông tin cá nhân</Typography>
              </Box>
              
              <Box 
                component="form" 
                onSubmit={handleProfileUpdate} 
                noValidate 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  flexGrow: 1
                }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Họ và tên"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  margin="normal"
                  fullWidth
                  id="phone"
                  label="Số điện thoại"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  sx={{ mb: 3 }}
                />
                
                <Box sx={{ flexGrow: 1 }}></Box>
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{ 
                    mt: 'auto',
                    bgcolor: '#D34F81',
                    '&:hover': {
                      bgcolor: '#b83e6a'
                    },
                    borderRadius: '8px',
                    py: 1.5
                  }}
                >
                  CẬP NHẬT THÔNG TIN
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          {/* Đổi mật khẩu */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: '#D34F81', width: 56, height: 56, mr: 2 }}>
                  <LockIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Đổi mật khẩu</Typography>
              </Box>
              
              <Box 
                component="form" 
                onSubmit={handlePasswordUpdate} 
                noValidate
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  flexGrow: 1
                }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="currentPassword"
                  label="Mật khẩu hiện tại"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="newPassword"
                  label="Mật khẩu mới"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="confirmPassword"
                  label="Xác nhận mật khẩu mới"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  sx={{ mb: 3 }}
                />
                
                <Box sx={{ flexGrow: 1 }}></Box>
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{ 
                    mt: 'auto',
                    bgcolor: '#D34F81',
                    '&:hover': {
                      bgcolor: '#b83e6a'
                    },
                    borderRadius: '8px',
                    py: 1.5
                  }}
                >
                  CẬP NHẬT MẬT KHẨU
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminProfile;