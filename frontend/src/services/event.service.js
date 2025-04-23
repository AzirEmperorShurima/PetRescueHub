import api from '../utils/axios';

const eventService = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  register: (eventId, userId) => api.post(`/events/${eventId}/register`, { userId }),
  getParticipants: (eventId) => api.get(`/events/${eventId}/participants`),
};

export default eventService;