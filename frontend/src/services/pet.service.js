import api from '../utils/axios';
import apiService from './api.service';

const petService = {
  // Sử dụng apiService cho các phương thức CRUD chuẩn
  ...apiService.pets,
  
  // Các phương thức tùy chỉnh
  uploadImage: (id, file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.upload(`/pets/${id}/image`, formData, onUploadProgress);
  },
};

export default petService;