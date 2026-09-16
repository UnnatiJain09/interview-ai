import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to inject Authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('interviewai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'An unexpected network error occurred.';
    return Promise.reject(new Error(message));
  }
);

// Auth APIs
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  demoLogin: () => api.post('/auth/demo'),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// User Profile APIs
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

// Interview Management APIs
export const interviewAPI = {
  create: (data) => api.post('/interviews', data),
  getAll: (params) => api.get('/interviews', { params }),
  getById: (id) => api.get(`/interviews/${id}`),
  start: (id) => api.post(`/interviews/${id}/start`),
  complete: (id) => api.post(`/interviews/${id}/complete`),
};

// Questions & Answer APIs
export const questionAPI = {
  getQuestions: (interviewId) => api.get(`/questions/interview/${interviewId}`),
  submitAnswer: (questionId, data) => api.post(`/questions/${questionId}/answer`, data),
};

// Speech Transcription API (Multipart FormData)
export const speechAPI = {
  transcribe: (formData) =>
    api.post('/speech/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

// Coding Assessment APIs
export const codingAPI = {
  runCode: (data) => api.post('/coding/run', data),
  submitCode: (data) => api.post('/coding/submit', data),
};

// Analytics & History APIs
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getPerformance: () => api.get('/analytics/performance'),
  getHistory: (params) => api.get('/analytics/history', { params }),
};

export default api;
