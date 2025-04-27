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

// Tạo các service cho từng entity
const apiService = {
  auth: {
    login: (credentials) => api.post('/auth/access/login', credentials, { withCredentials: true }),
    register: (userData) => api.post('/auth/sign/signup', userData),
    logout:() => api.post('/auth/logout', { withCredentials: true }),
    verify: () => api.get('/auth/verify'),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
    sendOTP: (email, type) => api.post('/auth/otp/send', { email, type }),
    verifyOTP: (userId, otp) => api.post('/auth/sign/verify-otp', { userId, otp }),
  },
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