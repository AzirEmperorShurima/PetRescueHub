import axios from 'axios';

// Cấu hình cơ bản
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 giây timeout
});

// Request interceptor - thêm token xác thực vào header
axiosInstance.interceptors.request.use(
  (config) => {
    // Ưu tiên token admin nếu đang ở trang admin
    const isAdminPage = window.location.pathname.includes('/admin');
    const token = isAdminPage 
      ? localStorage.getItem('adminToken') 
      : localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý lỗi và refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Xử lý lỗi 401 Unauthorized
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Kiểm tra nếu đang ở trang admin
      const isAdminPage = window.location.pathname.includes('/admin');
      
      if (isAdminPage) {
        // Đối với admin, chuyển hướng đến trang đăng nhập admin
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
      } else {
        // Đối với người dùng thông thường
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
      
      return Promise.reject(error);
    }
    
    // Xử lý lỗi mạng
    if (!error.response) {
      console.error('Network Error:', error);
      return Promise.reject({
        ...error,
        message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.'
      });
    }
    
    return Promise.reject(error);
  }
);

// Các phương thức API tiện ích
const api = {
  get: (url, config = {}) => axiosInstance.get(url, config),
  post: (url, data = {}, config = {}) => axiosInstance.post(url, data, config),
  put: (url, data = {}, config = {}) => axiosInstance.put(url, data, config),
  delete: (url, config = {}) => axiosInstance.delete(url, config),
  
  // Phương thức tải file
  upload: (url, formData, onUploadProgress) => {
    return axiosInstance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },
  
  // Phương thức tải xuống file
  download: (url, filename) => {
    return axiosInstance.get(url, {
      responseType: 'blob',
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  }
};

export { axiosInstance };
export default api;