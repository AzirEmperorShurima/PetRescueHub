import axios from 'axios';

// Cấu hình axios instance với URL cơ sở
const API_BASE_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Thêm dòng này
});

// Interceptor để thêm token vào header của mỗi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Xử lý lỗi chung
    if (error.response) {
      // Lỗi từ server (status code không phải 2xx)
      console.error('API Error:', error.response.data);
      
      // Xử lý lỗi 401 Unauthorized
      if (error.response.status === 401) {
        // Xóa thông tin đăng nhập và chuyển hướng đến trang đăng nhập
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        // window.location.href = '/auth/login';
      }
    } else if (error.request) {
      // Request đã được gửi nhưng không nhận được response
      console.error('No response received:', error.request);
    } else {
      // Lỗi khi thiết lập request
      console.error('Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;