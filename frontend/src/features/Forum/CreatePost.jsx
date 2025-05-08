import React, { useState, useEffect } from 'react';
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
  Autocomplete,
  Stack,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Image as ImageIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import forumService from '../../services/forum.service';

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState([
    'golden retriever', 'husky', 'corgi', 'poodle', 'chihuahua',
    'mèo anh lông ngắn', 'mèo ba tư', 'mèo munchkin', 'mèo ragdoll',
    'chăm sóc', 'huấn luyện', 'dinh dưỡng', 'sức khỏe', 'tiêm phòng',
    'cứu hộ', 'nhận nuôi', 'thức ăn', 'đồ chơi', 'phụ kiện'
  ]);
  
  
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
    
    if (tags.length > 5) {
      setError('Vui lòng chọn tối đa 5 thẻ');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      
      console.log('Tiêu đề:', title);
      console.log('Nội dung:', content);
      
      // Thay vì gửi JSON string, gửi từng tag riêng lẻ
      if (tags && tags.length > 0) {
        tags.forEach(tag => formData.append('tags', tag));
        console.log('Tags:', tags);
      }
      
      formData.append('postType', 'Post'); // Mặc định là loại Post
      console.log('Loại bài viết:', 'Post');
      
      let response;
      
      if (image) {
        formData.append('imgUrl', image);
        console.log('Có hình ảnh:', image.name);
        
        // Kiểm tra nội dung của FormData
        console.log('FormData entries:');
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }
        
        console.log('Gọi API tạo bài viết mới với hình ảnh...');
        response = await forumService.createNewPostWithImage(formData);
      } else {
        // Nếu không có hình ảnh, tạo đối tượng dữ liệu thông thường
        const postData = {
          title,
          content,
          tags: tags.length > 0 ? tags : [],
          postType: 'Post'
        };
        
        console.log('Gọi API tạo bài viết mới không có hình ảnh...');
        response = await forumService.createNewPost(postData);
      }
      
      console.log('Kết quả API:', response);
      
      if (response && response.success) {
        navigate('/forum');
      } else {
        setError(response?.message || 'Đã xảy ra lỗi khi tạo bài viết');
      }
    } catch (error) {
      console.error('Chi tiết lỗi khi tạo bài viết:', error.response || error);
      setError('Đã xảy ra lỗi khi tạo bài viết. Vui lòng thử lại sau.');
    } finally {
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
          
          <Autocomplete
            multiple
            freeSolo
            options={tagSuggestions}
            value={tags}
            onChange={(event, newValue) => setTags(newValue.slice(0, 5))}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip key={index} label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Thẻ (tối đa 5 thẻ)"
                placeholder="Nhập thẻ và nhấn Enter"
                helperText="Thẻ giúp người dùng tìm kiếm bài viết của bạn dễ dàng hơn"
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
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
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
