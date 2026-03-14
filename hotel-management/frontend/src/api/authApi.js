import axiosClient from './axiosClient';

const authApi = {
  // Login user
  login: (credentials) => {
    return axiosClient.post('/auth/login', credentials);
  },

  // Register user
  register: (userData) => {
    return axiosClient.post('/auth/register', userData);
  },

  // Logout (client-side only for now)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authApi;
