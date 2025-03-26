import api from '../utils/axios';

const volunteerService = {
  getAll: () => api.get('/volunteers'),
  getById: (id) => api.get(`/volunteers/${id}`),
  create: (data) => api.post('/volunteers', data),
  update: (id, data) => api.put(`/volunteers/${id}`, data),
  delete: (id) => api.delete(`/volunteers/${id}`),
  apply: (data) => api.post('/volunteers/apply', data),
};

export default volunteerService;