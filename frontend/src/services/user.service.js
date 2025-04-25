import api from '../utils/axios';
import apiService from './api.service';

const userService = {
  // Sử dụng apiService cho các phương thức CRUD chuẩn
  ...apiService.users,
  
  // Có thể thêm các phương thức tùy chỉnh ở đây nếu cần
};

export default userService;