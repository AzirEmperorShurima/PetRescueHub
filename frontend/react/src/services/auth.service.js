import api from '../utils/axios';
import { withErrorHandling } from '../utils/error-handler';

const authService = {
  login: withErrorHandling(
    (credentials) => api.post('/auth/login', credentials),
    { defaultErrorMessage: 'Đăng nhập thất bại' }
  ),
  
  register: withErrorHandling(
    (userData) => api.post('/auth/register', userData),
    { defaultErrorMessage: 'Đăng ký thất bại' }
  ),
  
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  },
  
  getCurrentUser: withErrorHandling(
    () => api.get('/auth/me'),
    { 
      defaultErrorMessage: 'Không thể tải thông tin người dùng',
      showToast: false // Không hiển thị toast cho lỗi này
    }
  ),
};

export default authService;