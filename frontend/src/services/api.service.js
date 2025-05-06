import api from '../utils/axios';

/**
 * Factory function tạo các phương thức API chuẩn cho một endpoint
 * @param {string} endpoint - Tên endpoint API
 * @returns {Object} - Các phương thức CRUD chuẩn
 */
const createApiService = (endpoint) => {
  return {
    getAll: (params = {}) => api.get(`/${endpoint}`, { params }),
    getById: (id, params = {}) => api.get(`/${endpoint}/${id}`, { params }),
    create: (data) => api.post(`/${endpoint}`, data),
    update: (id, data) => api.put(`/${endpoint}/${id}`, data),
    delete: (id) => api.delete(`/${endpoint}/${id}`),
  };
};

/**
 * API Service - Chỉ chứa các phương thức gọi API thuần túy
 * Không chứa logic xử lý dữ liệu
 */
const apiService = {
  auth: {
    // Xác thực
    login: (credentials) => api.post('/auth/access/login', credentials, { withCredentials: true }),
    register: (userData) => api.post('/auth/sign/signup', userData, { withCredentials: true } ),
    logout: () => api.post('/auth/logout', {}, { withCredentials: true }),
    refreshToken: () => api.post('/auth/re-sign/refresh-token', {}, { withCredentials: true }),
    
    // Quản lý mật khẩu 
    forgotPassword: (email) => api.post('/auth/password/forgot-password', { email }, { withCredentials: true } ),
    resetPassword: (newPassword, confirmPassword) => api.post('/auth/password/reset-password', { newPassword, confirmPassword }, { withCredentials: true }), 
    
    // Xác thực OTP
    verifyOTP: (otp) => api.post('/auth/sign/verify-otp', { otp }, { withCredentials: true }),
    otpResetPassword: (otp) => api.post('/auth/password/verify-otp-forgot-password', { otp }, { withCredentials: true }),
    resendOTP: () => api.get('/auth/sign/verify-otp/refreshOtp', { withCredentials: true } ),
    
    // Thông tin người dùng
    getProfile: (targetUser) => api.get(`/auth/get/profile${targetUser ? `/${targetUser}` : ''}`, { withCredentials: true } ),
    // updateProfile: (userData) => api.put('/auth/update/profile', userData, { withCredentials: true } ),
    // uploadAvatar: (formData) => api.upload('/auth/update/avatar', formData, { withCredentials: true }),
},
  
  // Các API khác
  users: createApiService('users'),
  pets: createApiService('pets'),
  volunteers: {
    ...createApiService('volunteers'),
    receiveRescueRequest: (data) => api.post('/volunteers/receive-rescue-request', data),
    manageRescueOperations: (data) => api.post('/volunteers/manage-rescue-operations', data),
  },
  donations: createApiService('donations'),
  events: createApiService('events'),
  rescues: createApiService('rescues'),
  forum: {
    posts: createApiService('forum/posts'),
    questions: createApiService('forum/questions'),
    comments: createApiService('forum/comments'),
    categories: createApiService('forum/categories'),
    tags: createApiService('forum/tags'),
  },
};

export default apiService;