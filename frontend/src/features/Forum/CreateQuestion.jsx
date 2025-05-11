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
  Autocomplete,
  Stack,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import forumService from '../../services/forum.service';
import ImageUploader from '../../components/common/ImageUploader/ImageUploader';
import './ForumForms.css'; // Cập nhật import

const CreateQuestion = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tagSuggestions] = useState([
    'golden retriever', 'husky', 'corgi', 'poodle', 'chihuahua',
    'mèo anh lông ngắn', 'mèo ba tư', 'mèo munchkin', 'mèo ragdoll',
    'chăm sóc', 'huấn luyện', 'dinh dưỡng', 'sức khỏe', 'tiêm phòng',
    'cứu hộ', 'nhận nuôi', 'thức ăn', 'đồ chơi', 'phụ kiện'
  ]);

  const handleImageUpload = (files) => {
    // Tạo URL preview cho các file ảnh
    const newPreviews = files.map(file => URL.createObjectURL(file));
    
    setImages([...images, ...files]);
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };
  
  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề câu hỏi');
      return;
    }
    
    if (!content.trim()) {
      setError('Vui lòng nhập nội dung câu hỏi');
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
      
      if (tags && tags.length > 0) {
        tags.forEach(tag => formData.append('tags', tag));
        console.log('Tags:', tags);
      }
      
      formData.append('postType', 'Question'); // Đặt loại là Question
      console.log('Loại bài viết:', 'Question');
      
      let response;
      
      if (images && images.length > 0) {
        images.forEach(image => formData.append('imgUrl', image));
        console.log('Số lượng hình ảnh:', images.length);
        
        // Kiểm tra nội dung của FormData
        console.log('FormData entries:');
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }
        
        console.log('Gọi API tạo câu hỏi mới với hình ảnh...');
        response = await forumService.createNewPostWithImage(formData);
      } else {
        const questionData = {
          title,
          content,
          tags: tags.length > 0 ? tags : [],
          postType: 'Question'
        };
        
        console.log('Gọi API tạo câu hỏi mới không có hình ảnh...');
        response = await forumService.createNewPost(questionData);
      }
      
      console.log('Kết quả API:', response);
      
      if (response && response.success) {
        navigate('/forum');
      } else {
        setError(response?.message || 'Đã xảy ra lỗi khi tạo câu hỏi');
      }
    } catch (error) {
      console.error('Chi tiết lỗi khi tạo câu hỏi:', error.response || error);
      setError('Đã xảy ra lỗi khi tạo câu hỏi. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/forum')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            Đặt câu hỏi mới
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Tiêu đề câu hỏi"
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
                helperText="Thẻ giúp người dùng tìm kiếm câu hỏi của bạn dễ dàng hơn"
              />
            )}
            sx={{ mb: 3 }}
          />
          
          <TextField
            label="Nội dung câu hỏi"
            variant="outlined"
            fullWidth
            multiline
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            sx={{ mb: 3 }}
          />
          
          <Box className="forum-image-uploader" sx={{ mb: 3 }}>
            <ImageUploader
              images={images}
              previews={imagePreviews}
              onUpload={handleImageUpload}
              onRemove={handleRemoveImage}
              maxImages={3}
              label="Hình ảnh (không bắt buộc)"
              required={false}
              acceptTypes="image/*"
            />
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
              {loading ? 'Đang tạo...' : 'Đăng câu hỏi'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateQuestion;