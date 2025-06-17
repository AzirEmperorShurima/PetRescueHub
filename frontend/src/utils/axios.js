import axios from 'axios';

// Cấu hình cơ bản
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
console.log('API_URL:', API_URL);

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // timeout: 15000, // 15 giây timeout
  withCredentials: true, // Gửi cookie với mỗi request
});

// Biến để kiểm soát quá trình refresh token
let isRefreshing = false;
let failedQueue = [];

// Hàm xử lý hàng đợi các request bị lỗi trong quá trình refresh token
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor - thêm token xác thực vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const isAdminPage = window.location.pathname.includes('/admin');
    const token = isAdminPage
      ? localStorage.getItem('adminToken')
      : localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - xử lý lỗi và refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra lỗi 401 và đảm bảo chưa thử refresh token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang trong quá trình refresh token, thêm request vào hàng đợi
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const isAdminPage = window.location.pathname.includes('/admin');
      const refreshToken = isAdminPage
        ? localStorage.getItem('adminRefreshToken')
        : localStorage.getItem('refreshToken');

      if (!refreshToken) {
        // Không có refresh token, chuyển hướng đến trang đăng nhập
        if (isAdminPage) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminRefreshToken');
          // window.location.href = '/admin/login';
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          // window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }

      try {
        // Gọi API refresh token
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { token: newToken, refreshToken: newRefreshToken } = response.data;

        // Lưu token mới
        if (isAdminPage) {
          localStorage.setItem('adminToken', newToken);
          localStorage.setItem('adminRefreshToken', newRefreshToken);
        } else {
          localStorage.setItem('token', newToken);
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
        originalRequest.headers.Authorization = 'Bearer ' + newToken;

        processQueue(null, newToken);

        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);

        // Refresh token thất bại, chuyển hướng đến trang đăng nhập
        if (isAdminPage) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminRefreshToken');
          window.location.href = '/admin/login';
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/auth/login';
        }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Xử lý lỗi mạng
    if (!error.response) {
      console.error('Lỗi mạng:', error);
      return Promise.reject({
        ...error,
        message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.',
      });
    }

    // Xử lý các lỗi khác
    if (error.response.status === 404) {
      console.error('Không tìm thấy tài nguyên:', error.config.url);
    } else if (error.response.status === 500) {
      console.error('Lỗi máy chủ:', error.response.data);
    } else if (error.code === 'ECONNABORTED') {
      console.error('Yêu cầu quá thời gian');
    } else {
      console.error('Lỗi API:', error);
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
    return axiosInstance
      .get(url, {
        responseType: 'blob',
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
  },
};

export { axiosInstance };
export default api;
