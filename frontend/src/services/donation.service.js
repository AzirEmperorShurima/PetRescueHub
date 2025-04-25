import api from '../utils/axios';
import apiService from './api.service';

// Sử dụng apiService hoặc trực tiếp gọi api từ axios
const donationService = {
  // Cách 1: Sử dụng apiService
  ...apiService.donations,
  
  // Cách 2: Tự định nghĩa (nếu cần logic đặc biệt)
  getByUser: (userId) => apiService.donations.getAll({ userId }),
  getStatistics: () => apiService.donations.getAll({ type: 'statistics' }),
};

export default donationService;