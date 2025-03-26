// Sử dụng instance đã cấu hình từ utils/axios.js
import api from '../utils/axios';

// Các dịch vụ API cụ thể
const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  },
  getCurrentUser: () => api.get('/auth/me'),
};

const userService = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

const petService = {
  getAll: () => api.get('/pets'),
  getById: (id) => api.get(`/pets/${id}`),
  create: (data) => api.post('/pets', data),
  update: (id, data) => api.put(`/pets/${id}`, data),
  delete: (id) => api.delete(`/pets/${id}`),
  uploadImage: (id, file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.upload(`/pets/${id}/image`, formData, onUploadProgress);
  },
};

// Xuất các dịch vụ
export {
  authService,
  userService,
  petService,
};

// Xuất API instance mặc định
export default api;