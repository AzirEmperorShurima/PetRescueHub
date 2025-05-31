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
  // Trong phần forum của apiService
  forum: {
    posts: {
      ...createApiService('forum/posts'),
      getAll: (params = {}) => api.get('/forum/GET/posts', { params }),
      getById: (id) => api.get(`/forum/GET/posts/${id}`),
      create: (data) => {
        // Kiểm tra nếu là FormData thì sử dụng Content-Type phù hợp
        if (data instanceof FormData) {
          return api.post('/forum/posts/new', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
          });
        }
        // Nếu không phải FormData thì sử dụng Content-Type mặc định
        return api.post('/forum/posts/new', data, { withCredentials: true });
      },
      update: (id, data) => api.put(`/forum/posts/${id}`, data, { withCredentials: true }),
      delete: (id) => api.delete(`/forum/posts/${id}`, { withCredentials: true }),
      favorite: {
        add: (postId) => api.post(`/forum/posts/${postId}/favorite`, {}, { withCredentials: true }),
        remove: (postId) => api.delete(`/forum/posts/${postId}/favorite`, { withCredentials: true }),
        getStatus: (postId) => api.get(`/forum/posts/${postId}/favorite`, { withCredentials: true })
      }
    },
    comments: {
      ...createApiService('forum/comments'),
      getByPost: (postId, params = {}) => api.get(`/forum/comments/${postId}`, { params, withCredentials: true }),
      create: (data) => {
        const simpleData = {
          postId: data.postId,
          content: data.content
        };
        return api.post('/forum/comments/new', simpleData, { 
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true 
        });
      },
      reply: (data) => {
        // Đảm bảo data là object đơn giản
        const simpleData = {
          postId: data.postId,
          content: data.content,
          parentComment: data.parentComment
        };
        return api.post('/forum/comments/reply', simpleData, { 
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true 
        });
      },
      update: (id, data) => {
        // Đảm bảo data là object đơn giản
        const simpleData = {
          content: data.content
        };
        return api.put(`/forum/comments/${id}`, simpleData, { 
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true 
        });
      },
      delete: (id) => api.delete(`/forum/comments/${id}`, { withCredentials: true }),
      getReplies: (commentId, params = {}) => api.get(`/forum/comments/GET-ReplyComments/${commentId}`, { params, withCredentials: true })
    },
    reactions: {
      addOrUpdate: (data) => api.post('/forum/reactions/post', data, { withCredentials: true }),
      getUserReaction: (targetType, targetId) => api.get(`/forum/reaction/${targetType}/${targetId}`, { withCredentials: true })
    },
    reports: {
      post: (postId, reason) => api.post(`/forum/reports/post/${postId}`, { reason }, { withCredentials: true }),
      comment: (commentId, reason) => api.post(`/forum/reports/comment/${commentId}`, { reason }, { withCredentials: true })
    }
  },


  pets: {
    profile: {
      getAll: (params = {}) => api.get('/pet/v1/get-pets/all-pet', { 
        params, 
        withCredentials: true 
      }),
      getById: (id) => api.get(`/pet/pets/${id}`, { 
        withCredentials: true 
      }),
      create: (data) => {
        if (data instanceof FormData) {
          return api.post('/pet/pets/portfolio/create', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
          });
        }
        return api.post('pet/pets/profiles/create', data, { 
          withCredentials: true 
        });
      },
      update: (id, data) => {
        if (data instanceof FormData) {
          return api.put(`pet/pets/profiles/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
          });
        }
        return api.put(`pet/pets/profiles/${id}`, data, { 
          withCredentials: true 
        });
      },
      delete: (id) => api.delete(`pet/pets/profiles/${id}`, { 
        withCredentials: true 
      })
    }
  },
  volunteers: {
    ...createApiService('volunteers'),
    receiveRescueRequest: (data) => api.post('/volunteers/receive-rescue-request', data),
    manageRescueOperations: (data) => api.post('/volunteers/manage-rescue-operations', data),
  },
  donations: createApiService('donations'),
  events: createApiService('events'),
  rescues: {
    create: (formData) => {
      return api.post('/PetRescue/rescue/requests/v2/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
    }
  },
};

export default apiService;