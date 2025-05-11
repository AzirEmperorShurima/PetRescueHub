import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Button, 
  TextField, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip,
  OutlinedInput,
  IconButton,
  InputAdornment,
  Divider
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import ImageUploader from '../../components/common/ImageUploader/ImageUploader';
import './CreateEvent.css';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const availableTags = [
  'nhận nuôi', 'chó', 'mèo', 'hội thảo', 'chăm sóc', 'khám sức khỏe', 
  'miễn phí', 'cuộc thi', 'giải thưởng', 'huấn luyện', 'workshop', 
  'triển lãm', 'sản phẩm', 'từ thiện', 'quyên góp'
];

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: null,
    endDate: null,
    category: '',
    tags: [],
    images: []
  });
  
  const [imagePreviews, setImagePreviews] = useState([]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleTagChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData({
      ...formData,
      tags: typeof value === 'string' ? value.split(',') : value,
    });
  };
  
  const handleDateChange = (name) => (newValue) => {
    setFormData({
      ...formData,
      [name]: newValue
    });
  };
  
  const handleImageUpload = (files) => {
    // Tạo URL preview cho các file ảnh
    const newPreviews = files.map(file => URL.createObjectURL(file));
    
    setFormData({
      ...formData,
      images: [...formData.images, ...files]
    });
    
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };
  
  const handleRemoveImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    
    setFormData({
      ...formData,
      images: newImages
    });
    
    setImagePreviews(newPreviews);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    // Trong thực tế, bạn sẽ gọi API để tạo sự kiện
    // const formDataToSend = new FormData();
    // formDataToSend.append('title', formData.title);
    // formDataToSend.append('description', formData.description);
    // formData.images.forEach(image => formDataToSend.append('images', image));
    // api.post('/events', formDataToSend);
    
    // Giả lập thành công và chuyển hướng
    alert('Tạo sự kiện thành công!');
    navigate('/event');
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/event')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            Tạo sự kiện mới
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Tiêu đề sự kiện"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Mô tả"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                required
                multiline
                rows={4}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Địa điểm"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                fullWidth
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Thời gian bắt đầu"
                  value={formData.startDate}
                  onChange={handleDateChange('startDate')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarIcon />
                          </InputAdornment>
                        ),
                      }
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Thời gian kết thúc"
                  value={formData.endDate}
                  onChange={handleDateChange('endDate')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarIcon />
                          </InputAdornment>
                        ),
                      }
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Danh mục</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  label="Danh mục"
                >
                  <MenuItem value="adoption">Nhận nuôi</MenuItem>
                  <MenuItem value="workshop">Hội thảo</MenuItem>
                  <MenuItem value="health">Sức khỏe</MenuItem>
                  <MenuItem value="competition">Cuộc thi</MenuItem>
                  <MenuItem value="charity">Từ thiện</MenuItem>
                  <MenuItem value="other">Khác</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Thẻ</InputLabel>
                <Select
                  multiple
                  value={formData.tags}
                  onChange={handleTagChange}
                  input={<OutlinedInput label="Thẻ" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {availableTags.map((tag) => (
                    <MenuItem key={tag} value={tag}>
                      {tag}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Box className="event-image-uploader">
                <ImageUploader
                  images={formData.images}
                  previews={imagePreviews}
                  onUpload={handleImageUpload}
                  onRemove={handleRemoveImage}
                  maxImages={3}
                  label="Hình ảnh sự kiện"
                  required={false}
                  acceptTypes="image/*"
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/event')}
                  startIcon={<ArrowBackIcon />}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  startIcon={<AddIcon />}
                >
                  Tạo sự kiện
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateEvent;