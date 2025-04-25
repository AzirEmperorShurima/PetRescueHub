import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Stack,
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Image as ImageIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import apiService from '../../services/api.service';

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const categories = [
    { id: 'dog', name: 'Chó' },
    { id: 'cat', name: 'Mèo' },
    { id: 'rescue', name: 'Cứu hộ' },
    { id: 'adoption', name: 'Nhận nuôi' },
    { id: 'health', name: 'Sức khỏe' },
    { id: 'training', name: 'Huấn luyện' },
    { id: 'food', name: 'Thức ăn' },
    { id: 'accessories', name: 'Phụ kiện' }
  ];
  
  const tagSuggestions = [
    'golden retriever', 'husky', 'corgi', 'poodle', 'chihuahua',
    'mèo anh lông ngắn', 'mèo ba tư', 'mèo munchkin', 'mèo ragdoll',
    'chăm sóc', 'huấn luyện', 'dinh dưỡng', 'sức khỏe', 'tiêm phòng',
    'cứu hộ', 'nhận nuôi', 'thức ăn', 'đồ chơi', 'phụ kiện'
  ];
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề bài viết');
      return;
    }
    
    if (!content.trim()) {
      setError('Vui lòng nhập nội dung bài viết');
      return;
    }
    
    if (!category) {
      setError('Vui lòng chọn danh mục');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Trong thực tế, bạn sẽ gọi API để tạo bài viết
      // const formData = new FormData();
      // formData.append('title', title);
      // formData.append('content', content);
      // formData.append('category', category);
      // formData.append('tags', JSON.stringify(tags));
      // if (image) {
      //   formData.append('image', image);
      // }
      // const response = await apiService.forum.posts.create(formData);
      
      // Giả lập thành công
      setTimeout(() => {
        setLoading(false);
        navigate('/forum');
      }, 1000);
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Đã xảy ra lỗi khi tạo bài viết. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => navigate('/forum')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h1">
            Tạo bài viết mới
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Tiêu đề bài viết"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ mb: 3 }}
          />
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="category-label">Danh mục</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Danh mục"
              required
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Autocomplete
            multiple
            freeSolo
            options={tagSuggestions}
            value={tags}
            onChange={(event, newValue) => setTags(newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Thẻ (tối đa 5 thẻ)"
                placeholder="Nhập thẻ và nhấn Enter"
              />
            )}
            sx={{ mb: 3 }}
          />
          
          <TextField
            label="Nội dung bài viết"
            variant="outlined"
            fullWidth
            multiline
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            sx={{ mb: 3 }}
          />
          
          <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom>
              Hình ảnh (không bắt buộc)
            </Typography>
            
            {!imagePreview ? (
              <Button
                variant="outlined"
                component="label"
                startIcon={<ImageIcon />}
              >
                Tải lên hình ảnh
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
            ) : (
              <Box position="relative" display="inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: '4px'
                  }}
                />
                <IconButton
                  color="error"
                  onClick={handleRemoveImage}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)'
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Box>
          
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={() => navigate('/forum')}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? 'Đang tạo...' : 'Tạo bài viết'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreatePost;