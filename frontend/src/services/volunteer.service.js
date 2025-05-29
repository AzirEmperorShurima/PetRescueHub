import api from '../utils/axios';
import apiService from './api.service';

const volunteerService = {
  // Sử dụng apiService cho các phương thức CRUD chuẩn
  ...apiService.volunteers,
  
  // Đăng ký tình nguyện viên mới
  register: (data) => apiService.volunteers.create(data),
  
  // Đăng ký nhận yêu cầu cứu hộ
  receiveRescueRequest: (data) => apiService.volunteers.receiveRescueRequest(data),
  
  // Quản lý hoạt động cứu hộ
  manageRescueOperations: (data) => apiService.volunteers.manageRescueOperations(data),
  
  // Gửi yêu cầu trở thành tình nguyện viên
  requestVolunteer: () => api.post('/volunteer/v1/requesting/grow-up/volunteer')
};

export default volunteerService;