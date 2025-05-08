import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Card,
  CardMedia,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stack,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import './FindHome.css';
import { useAuth } from '../../components/contexts/AuthContext';
import { useNotification } from '../../components/contexts/NotificationContext';

const FindHome = () => {
  const { user } = useAuth();
  const { showError } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      showError('Vui lòng đăng nhập để sử dụng tính năng này');
      navigate('/auth/login');
    }
  }, [user, navigate, showError]);

  const [petData, setPetData] = useState({
    name: '',
    type: 'dog',
    breed: '',
    breedName: '',
    age: '',
    gender: 'male',
    description: '',
    weight: '',
    height: '',
    reproductiveStatus: 'not neutered',
    healthStatus: '',
    vaccinationStatus: [],
    microchipId: '',
    image: '',
    petAlbum: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    
    setPetData(prev => ({
      ...prev,
      petAlbum: [...prev.petAlbum, ...newImages]
    }));
  };

  const handleRemoveImage = (index) => {
    setPetData(prev => ({
      ...prev,
      petAlbum: prev.petAlbum.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!petData.name || !petData.type || !petData.breed) {
        showError('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }

      // Gọi API để tạo profile (sẽ implement sau)
      setSuccess('Tạo hồ sơ thú cưng thành công!');
      setTimeout(() => {
        navigate('/adopt');
      }, 2000);
    } catch (err) {
      setError('Có lỗi xảy ra khi tạo hồ sơ thú cưng');
    }
  };

  // Trong phần render của component
  return (
    <Box className="find-home-page">
      <Container maxWidth="lg">
        <Box className="find-home-header">
          <Typography variant="h3" component="h1" gutterBottom className="find-home-title">
            Tạo Hồ Sơ Thú Cưng
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Điền thông tin thú cưng của bạn để tìm một gia đình mới
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card className="pet-form-card" sx={{ p: 3 }}>
                <CardContent sx={{ p: 2 }}>
                  <Stack spacing={4}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          fullWidth
                          label="Tên thú cưng"
                          name="name"
                          value={petData.name}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Loại thú cưng</InputLabel>
                          <Select
                            name="type"
                            value={petData.type}
                            onChange={handleChange}
                            label="Loại thú cưng"
                          >
                            <MenuItem value="dog">Chó</MenuItem>
                            <MenuItem value="cat">Mèo</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Giống"
                          name="breed"
                          value={petData.breed}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Tên giống"
                          name="breedName"
                          value={petData.breedName}
                          onChange={handleChange}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Tuổi"
                          name="age"
                          type="number"
                          value={petData.age}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Cân nặng (kg)"
                          name="weight"
                          type="number"
                          value={petData.weight}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Chiều cao (cm)"
                          name="height"
                          type="number"
                          value={petData.height}
                          onChange={handleChange}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Giới tính</InputLabel>
                          <Select
                            name="gender"
                            value={petData.gender}
                            onChange={handleChange}
                            label="Giới tính"
                          >
                            <MenuItem value="male">Đực</MenuItem>
                            <MenuItem value="female">Cái</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Tình trạng sinh sản</InputLabel>
                          <Select
                            name="reproductiveStatus"
                            value={petData.reproductiveStatus}
                            onChange={handleChange}
                            label="Tình trạng sinh sản"
                          >
                            <MenuItem value="neutered">Đã triệt sản</MenuItem>
                            <MenuItem value="not neutered">Chưa triệt sản</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Mô tả chi tiết"
                      name="description"
                      value={petData.description}
                      onChange={handleChange}
                    />

                    <TextField
                      fullWidth
                      label="Mã chip (nếu có)"
                      name="microchipId"
                      value={petData.microchipId}
                      onChange={handleChange}
                    />

                    <TextField
                      fullWidth
                      label="Tình trạng sức khỏe"
                      name="healthStatus"
                      value={petData.healthStatus}
                      onChange={handleChange}
                      multiline
                      rows={2}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card className="pet-form-card">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Hình ảnh thú cưng
                  </Typography>
                  <Box className="image-upload-section">
                    <input
                      accept="image/*"
                      type="file"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                      id="pet-image-upload"
                      multiple
                    />
                    <label htmlFor="pet-image-upload">
                      <IconButton component="span" color="primary">
                        <AddPhotoAlternateIcon fontSize="large" />
                      </IconButton>
                      <Typography variant="body2" color="textSecondary">
                        Tải lên hình ảnh thú cưng (có thể chọn nhiều ảnh)
                      </Typography>
                    </label>
                  </Box>
                  {petData.petAlbum.length > 0 && (
                    <Box className="image-preview-grid">
                      {petData.petAlbum.map((image, index) => (
                        <Box key={index} className="image-preview-item">
                          <CardMedia
                            component="img"
                            image={image}
                            alt={`Pet preview ${index + 1}`}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveImage(index)}
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              bgcolor: 'rgba(255,255,255,0.8)',
                              '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.9)'
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              className="submit-button"
              sx={{ minWidth: 200 }}
            >
              Tạo hồ sơ
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default FindHome;