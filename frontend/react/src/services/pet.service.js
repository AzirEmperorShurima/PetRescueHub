import api from '../utils/axios';

const petService = {
  getAll: () => api.get('/pets'),
  getById: (id) => api.get(`/pets/${id}`),
  create: (data) => api.post('/pets', data),
  update: (id, data) => api.put(`/pets/${id}`, data),
  delete: (id) => api.delete(`/pets/${id}`),
  uploadImage: (id, file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.upload(`/pets/${id}/image`, formData, onUploadProgress);
  },
};

export default petService;