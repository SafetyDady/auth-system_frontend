import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

// API Configuration
const API_BASE_URL = 'https://web-production-5b6ab.up.railway.app';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove('auth_token');
      Cookies.remove('user_data');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      toast.error('Access denied. You do not have permission.');
    } else if (error.response?.status === 429) {
      toast.error('Too many requests. Please try again later.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    Cookies.remove('auth_token');
    Cookies.remove('user_data');
    window.location.href = '/login';
  }
};

// System API
export const systemAPI = {
  getHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getDashboard: async () => {
    try {
      const response = await api.get('/dashboard');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// User Management API (to be implemented in backend)
export const userAPI = {
  getUsers: async () => {
    try {
      // This endpoint needs to be implemented in backend
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      // For now, return mock data if endpoint doesn't exist
      if (error.response?.status === 404) {
        return [
          {
            id: '1',
            username: 'superadmin',
            email: 'superadmin@example.com',
            role: 'superadmin',
            is_active: true,
            created_at: '2025-08-04T10:18:59.665819'
          },
          {
            id: '2',
            username: 'admin1',
            email: 'admin1@example.com',
            role: 'admin',
            is_active: true,
            created_at: '2025-08-04T10:19:59.665819'
          },
          {
            id: '3',
            username: 'admin2',
            email: 'admin2@example.com',
            role: 'admin',
            is_active: true,
            created_at: '2025-08-04T10:20:59.665819'
          }
        ];
      }
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  toggleUserStatus: async (userId, isActive) => {
    try {
      const response = await api.patch(`/users/${userId}`, { is_active: isActive });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;

