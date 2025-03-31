import api from './api';

const volunteerService = {
  // Đăng ký tình nguyện viên mới
  register: (data) => api.post('/volunteers/register', data),
  
  // Lấy danh sách tình nguyện viên
  getAll: () => api.get('/volunteers'),
  
  // Lấy thông tin chi tiết tình nguyện viên
  getById: (id) => api.get(`/volunteers/${id}`),
  
  // Cập nhật thông tin tình nguyện viên
  update: (id, data) => api.put(`/volunteers/${id}`, data),
  
  // Xóa tình nguyện viên
  delete: (id) => api.delete(`/volunteers/${id}`),
  
  // Đăng ký nhận yêu cầu cứu hộ
  receiveRescueRequest: (data) => api.post('/volunteers/receive-rescue-request', data),
  
  // Quản lý hoạt động cứu hộ
  manageRescueOperations: (data) => api.post('/volunteers/manage-rescue-operations', data)
};

export default volunteerService;