import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

export const taskService = {
  getAll: (params) => api.get('/tasks', { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (taskData) => api.post('/tasks', taskData),
  update: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  delete: (id) => api.delete(`/tasks/${id}`),
  getStats: () => api.get('/tasks/stats'),
};

export const commentService = {
  getByTaskId: (taskId) => api.get(`/tasks/${taskId}/comments`),
  create: (taskId, content) => api.post(`/tasks/${taskId}/comments`, { content }),
  delete: (id) => api.delete(`/tasks/comments/${id}`),
};

export const userService = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
};

export const activityService = {
  getByTaskId: (taskId) => api.get(`/activities/tasks/${taskId}`),
  getRecent: (limit) => api.get('/activities/recent', { params: { limit } }),
};

export default api;
