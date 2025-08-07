import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

// API Configuration - ใช้ direct URL ใน production
const getApiBaseURL = () => {
  // ใน production ใช้ direct URL ไป Railway
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || 'https://web-production-5b6ab.up.railway.app';
  }
  // ใน development ใช้ proxy
  return '/api';
};

const API_BASE_URL = getApiBaseURL();

console.log('🔧 API Configuration Debug:');
console.log('- API Base URL:', API_BASE_URL);
console.log('- Environment:', import.meta.env.VITE_ENV || 'development');
console.log('- Dev mode:', import.meta.env.DEV);
console.log('- VITE_API_URL:', import.meta.env.VITE_API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');
    console.log('🔍 API Request Details:', {
      url: config.url,
      baseURL: config.baseURL,
      method: config.method?.toUpperCase(),
      fullURL: `${config.baseURL}${config.url}`,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'NO TOKEN'
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('⚠️ No auth token found in cookies!');
    }
    return config;
  },
  (error) => {
    console.error('🚨 Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      hasData: !!response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?.data
    });
    
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
      console.log('🌐 Making API call to /dashboard...');
      console.log('API Base URL:', API_BASE_URL);
      const response = await api.get('/dashboard');
      console.log('✅ Dashboard API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Dashboard API error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      // If dashboard endpoint fails, return minimal data
      if (error.response?.status === 404) {
        console.log('📝 Dashboard endpoint not found, returning fallback');
        return {
          message: 'Dashboard endpoint not available',
          role: 'unknown',
          access_level: 'basic'
        };
      }
      throw error;
    }
  }
};

// User Management API
export const userAPI = {
  getUsers: async () => {
    console.log('🔍 Calling userAPI.getUsers()...');
    try {
      const response = await api.get('/users/');  // เพิ่ม trailing slash
      console.log('✅ Users API Success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Users API Error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw error;
    }
  },

  createUser: async (userData) => {
    console.log('🔍 Creating user:', userData);
    try {
      const response = await api.post('/users/', userData);
      console.log('✅ Create user success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Create user error:', error);
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    console.log('🔍 Updating user:', userId, userData);
    try {
      const response = await api.put(`/users/${userId}`, userData);
      console.log('✅ Update user success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Update user error:', error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    console.log('🔍 Deleting user:', userId);
    try {
      const response = await api.delete(`/users/${userId}`);
      console.log('✅ Delete user success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Delete user error:', error);
      throw error;
    }
  },

  toggleUserStatus: async (userId, isActive) => {
    console.log('🔍 Toggling user status:', userId, isActive);
    try {
      const response = await api.patch(`/users/${userId}/status`, { is_active: isActive });
      console.log('✅ Toggle status success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Toggle status error:', error);
      throw error;
    }
  },

  getUserProfile: async () => {
    console.log('🔍 Getting current user profile...');
    try {
      const response = await api.get('/users/me');
      console.log('✅ Get profile success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get profile error:', error);
      throw error;
    }
  },

  updateProfile: async (userData) => {
    console.log('🔍 Updating profile:', userData);
    try {
      const response = await api.put('/users/me', userData);
      console.log('✅ Update profile success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Update profile error:', error);
      throw error;
    }
  },

  changePassword: async (passwordData) => {
    console.log('🔍 Changing password...');
    try {
      const response = await api.post('/users/me/change-password', passwordData);
      console.log('✅ Change password success:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Change password error:', error);
      throw error;
    }
  }
};

// Connection check utility
export const connectionCheck = {
  // Check if backend is reachable
  checkBackendHealth: async () => {
    try {
      // Try a simple GET request to a known endpoint
      // Using a lightweight endpoint or just test the base URL
      const response = await api.get('/', { timeout: 5000 });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Backend health check failed:', error.message);
      
      // If it's a 404, the server is actually responding
      if (error.response?.status === 404) {
        return { success: true, data: 'Server is responding' };
      }
      
      return { 
        success: false, 
        error: error.message,
        isTimeout: error.code === 'ECONNABORTED'
      };
    }
  },

  // Switch to Railway if local server is down
  switchToRailway: () => {
    const railwayURL = import.meta.env.VITE_RAILWAY_API_URL || 'https://web-production-5b6ab.up.railway.app';
    api.defaults.baseURL = railwayURL;
    console.log('Switched to Railway backend:', railwayURL);
    toast.info('Switched to Railway backend server');
  },

  // Switch back to local development server
  switchToLocal: () => {
    if (import.meta.env.DEV) {
      api.defaults.baseURL = '/api';
      console.log('Switched to local development server');
      toast.info('Connected to local development server');
    }
  },
};

export default api;

// Named export for compatibility
export { api };

