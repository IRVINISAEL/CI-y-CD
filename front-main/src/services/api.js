import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  verifyToken: () => api.get('/auth/verify'),
};

export const paymentsAPI = {
  getPendingPayments: () => api.get('/payments/pending'),
  processPayment: (paymentId, paymentData) => 
    api.post(`/payments/process/${paymentId}`, paymentData),
  getPaymentHistory: () => api.get('/payments/history'),
  generateReceipt: (paymentId) => api.get(`/payments/receipt/${paymentId}`),
  
  // Nuevos endpoints admin
  getAllPayments: (params) => api.get('/admin/payments', { params }),
  getAllStudents: (params) => api.get('/admin/students', { params }),
  getPaymentStats: () => api.get('/admin/stats'),
  createBulkPayments: (data) => api.post('/admin/payments/bulk', data),
};

export default api;