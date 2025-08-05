import { useState, useEffect, createContext, useContext } from 'react';
import { authAPI } from '../lib/api';
import { 
  getToken, 
  setToken, 
  getUserData, 
  setUserData, 
  clearAuthData, 
  isAuthenticated as checkAuth,
  getRedirectPath
} from '../lib/auth';
import { toast } from 'react-toastify';

// Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserData());
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      const userData = getUserData();

      if (token && userData) {
        try {
          // Verify token with backend
          const currentUser = await authAPI.getCurrentUser();
          setUser(currentUser);
          setUserData(currentUser);
          setIsAuthenticated(true);
        } catch (error) {
          // Token invalid, clear auth data
          clearAuthData();
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login(credentials);
      
      const { access_token, user: userData } = response;
      
      // Store token and user data
      setToken(access_token);
      setUserData(userData);
      setUser(userData);
      setIsAuthenticated(true);
      
      toast.success('Login successful!');
      
      // Redirect based on role
      const redirectPath = getRedirectPath(userData.role);
      window.location.href = redirectPath;
      
      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Login failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    clearAuthData();
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
    window.location.href = '/login';
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(userData);
    setUserData(userData);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

