import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

export const orderService = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  delete: (id) => api.delete(`/orders/${id}`),
  getStats: () => api.get('/orders/stats'),
};

export const clientService = {
  getAll: () => api.get('/clients'),
  getById: (id) => api.get(`/clients/${id}`),
  create: (data) => api.post('/clients', data),
};

export default api;
