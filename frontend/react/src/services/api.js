import axios from '../utils/axios';

// Tạo service API tập trung
const createApiService = (endpoint) => {
  return {
    getAll: (params = {}) => axios.get(`/${endpoint}`, { params }),
    getById: (id, params = {}) => axios.get(`/${endpoint}/${id}`, { params }),
    create: (data) => axios.post(`/${endpoint}`, data),
    update: (id, data) => axios.put(`/${endpoint}/${id}`, data),
    delete: (id) => axios.delete(`/${endpoint}/${id}`),
    // Các phương thức tùy chỉnh có thể được thêm vào đây
  };
};

// Tạo các service cho từng entity
const api = {
  auth: {
    login: (credentials) => axios.post('/auth/login', credentials),
    register: (userData) => axios.post('/auth/register', userData),
    verify: () => axios.get('/auth/verify'),
    forgotPassword: (email) => axios.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => axios.post('/auth/reset-password', { token, password }),
  },
  users: createApiService('users'),
  pets: createApiService('pets'),
  volunteers: {
    ...createApiService('volunteers'),
    receiveRescueRequest: (data) => axios.post('/volunteers/receive-rescue-request', data),
    manageRescueOperations: (data) => axios.post('/volunteers/manage-rescue-operations', data),
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
  // Thêm các service khác khi cần
};

export default api;