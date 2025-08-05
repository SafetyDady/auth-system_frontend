import Cookies from 'js-cookie';

// Token management
export const getToken = () => {
  return Cookies.get('auth_token');
};

export const setToken = (token) => {
  // Set cookie with 1 hour expiry (same as JWT)
  Cookies.set('auth_token', token, { expires: 1/24 });
};

export const removeToken = () => {
  Cookies.remove('auth_token');
};

// User data management
export const getUserData = () => {
  const userData = Cookies.get('user_data');
  return userData ? JSON.parse(userData) : null;
};

export const setUserData = (userData) => {
  Cookies.set('user_data', JSON.stringify(userData), { expires: 1/24 });
};

export const removeUserData = () => {
  Cookies.remove('user_data');
};

// Authentication checks
export const isAuthenticated = () => {
  const token = getToken();
  const userData = getUserData();
  return !!(token && userData);
};

export const hasRole = (requiredRole) => {
  const userData = getUserData();
  if (!userData) return false;
  
  const userRole = userData.role;
  
  // Role hierarchy: superadmin > admin > user
  const roleHierarchy = {
    'superadmin': 3,
    'admin': 2,
    'user': 1
  };
  
  const userLevel = roleHierarchy[userRole] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;
  
  return userLevel >= requiredLevel;
};

export const canManageUser = (targetUser) => {
  const currentUser = getUserData();
  if (!currentUser) return false;
  
  // Superadmin can manage everyone
  if (currentUser.role === 'superadmin') return true;
  
  // Admin can only manage users with 'user' role
  if (currentUser.role === 'admin') {
    return targetUser.role === 'user';
  }
  
  // Users can only manage themselves
  if (currentUser.role === 'user') {
    return currentUser.id === targetUser.id;
  }
  
  return false;
};

export const getRedirectPath = (role) => {
  switch (role) {
    case 'superadmin':
      return '/dashboard';
    case 'admin':
      return '/dashboard';
    case 'user':
      return '/profile';
    default:
      return '/login';
  }
};

// Clear all auth data
export const clearAuthData = () => {
  removeToken();
  removeUserData();
};

