import React from 'react';
import { Box, IconButton, Typography, Button } from '@mui/material';
import { AddPhotoAlternate as AddPhotoAlternateIcon, Delete as DeleteIcon } from '@mui/icons-material';
import './ImageUploader.css';

/**
 * Component tải lên và hiển thị hình ảnh với chức năng xóa
 * 
 * @param {Object} props - Props của component
 * @param {Array} props.images - Mảng các đối tượng File hoặc URL string của ảnh
 * @param {Array} props.previews - Mảng các URL preview của ảnh
 * @param {Function} props.onUpload - Hàm xử lý khi tải ảnh lên
 * @param {Function} props.onRemove - Hàm xử lý khi xóa ảnh
 * @param {number} props.maxImages - Số lượng ảnh tối đa được phép tải lên (mặc định: 5)
 * @param {string} props.label - Nhãn hiển thị (mặc định: "Hình ảnh")
 * @param {boolean} props.required - Có bắt buộc tải ảnh lên không (mặc định: false)
 * @param {string} props.acceptTypes - Các loại file được chấp nhận (mặc định: "image/*")
 */
const ImageUploader = ({
  images = [],
  previews = [],
  onUpload,
  onRemove,
  maxImages = 5,
  label = "Hình ảnh",
  required = false,
  acceptTypes = "image/*"
}) => {
  const handleImageChange = (e) => {
    if (onUpload && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      // Kiểm tra số lượng ảnh tối đa
      if (images.length + files.length > maxImages) {
        alert(`Chỉ được tải lên tối đa ${maxImages} ảnh`);
        return;
      }
      
      onUpload(files);
    }
  };

  const handleRemoveImage = (index) => {
    if (onRemove) {
      onRemove(index);
    }
  };

  return (
    <Box className="image-uploader-container">
      <Typography variant="subtitle1" gutterBottom>
        {label} {required && <span className="required-mark">*</span>}
      </Typography>
      
      <Box className="image-preview-container">
        {previews.map((preview, index) => (
          <Box key={index} className="image-preview-item">
            <img src={preview} alt={`Ảnh ${index + 1}`} className="preview-image" />
            <IconButton 
              className="remove-image-button"
              onClick={() => handleRemoveImage(index)}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        
        {images.length < maxImages && (
          <Button
            variant="outlined"
            component="label"
            startIcon={<AddPhotoAlternateIcon />}
            className="upload-button"
          >
            Tải lên
            <input
              type="file"
              hidden
              accept={acceptTypes}
              onChange={handleImageChange}
              multiple
            />
          </Button>
        )}
      </Box>
      
      <Typography variant="caption" color="textSecondary">
        {`Tối đa ${maxImages} ảnh. ${previews.length}/${maxImages} đã tải lên.`}
      </Typography>
    </Box>
  );
};

export default ImageUploader;