import axios from 'axios';

// Set up default axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Crucial to send/receive HTTPOnly cookies (access_token, refresh_token)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token fallback if available in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response.data, // Simplify data access in queries
  (error) => {
    // Extract server error messages if available
    const message = error.response?.data?.detail || error.response?.data?.message || 'An unexpected error occurred';
    const status = error.response?.status;

    const apiError = new Error(message);
    apiError.status = status;
    apiError.originalError = error;

    return Promise.reject(apiError);
  }
);

export default api;
