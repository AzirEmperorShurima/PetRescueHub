import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Alert,
  InputAdornment,
  IconButton,
  Link
} from '@mui/material';
import { LockOutlined, Email, Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import logo from '../../../assets/images/logo.svg';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Gọi API đăng nhập
      const response = await axios.post('/api/admin/auth/login', formData, { withCredentials: true });
      const { user } = response.data;
      console.log('User login response:', user);

      // Kiểm tra quyền admin (dành cho cả mảng object và mảng string)
      const isAdmin = Array.isArray(user.roles)
        ? user.roles.some(r => (typeof r === 'string' ? (r === 'admin' || r === 'super_admin') : (r.name === 'admin' || r.name === 'super_admin')))
        : false;

      if (!isAdmin) {
        setError('Tài khoản không có quyền quản trị.');
        return;
      }

      // Không cần lưu token, server đã set cookie
      navigate('/admin');
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Đăng nhập thất bại. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(211, 79, 129, 0.15)',
            border: '1px solid rgba(211, 79, 129, 0.1)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <img src={logo} alt="Pet Rescue Hub Logo" style={{ height: 50, marginRight: 10 }} />
            <Typography variant="h5" sx={{ color: '#D34F81', fontWeight: 600 }}>
              Pet Rescue Hub
            </Typography>
          </Box>

          <Avatar sx={{ m: 1, bgcolor: '#D34F81', width: 56, height: 56 }}>
            <LockOutlined fontSize="large" />
          </Avatar>
          
          <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Đăng nhập quản trị viên
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#D34F81' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#D34F81',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#D34F81',
                },
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: '#D34F81' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#D34F81',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#D34F81',
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,
                mb: 3,
                py: 1.5,
                bgcolor: '#D34F81',
                '&:hover': {
                  bgcolor: '#b83e6a',
                },
                borderRadius: 2,
                fontWeight: 600,
                boxShadow: '0 4px 10px rgba(211, 79, 129, 0.25)',
              }}
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link href="/" variant="body2" sx={{ color: '#D34F81' }}>
                Quay lại trang chủ
              </Link>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Pet Rescue Hub
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminLogin;