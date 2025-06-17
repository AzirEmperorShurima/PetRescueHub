import api from '../utils/axios';
import apiService from './api.service';

const eventService = {
  // Sử dụng apiService cho các phương thức CRUD chuẩn
  ...apiService.events,
  
  // Các phương thức tùy chỉnh
  register: (eventId, userId) => api.post(`/events/${eventId}/register`, { userId }),
  getParticipants: (eventId) => api.get(`/events/${eventId}/participants`),
};

export default eventService;