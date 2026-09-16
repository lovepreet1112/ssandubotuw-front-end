import apiRequest from '../helpers/apiRequest';

export const authService = {
  signup: async (userData) => {
    return await apiRequest({
      method: 'POST',
      url: '/auth/signup',
      data: userData,
      showToast: true,
      successMessage: 'Welcome to Sandh Boutique! Account created successfully.',
    });
  },

  login: async (credentials) => {
    return await apiRequest({
      method: 'POST',
      url: '/auth/login',
      data: credentials,
      showToast: true,
      successMessage: 'Welcome back to Sandh Boutique!',
    });
  },

  logout: async () => {
    return await apiRequest({
      method: 'POST',
      url: '/auth/logout',
      showToast: true,
      successMessage: 'You have been logged out safely.',
    });
  },

  getMe: async () => {
    return await apiRequest({
      method: 'GET',
      url: '/auth/me',
      showToast: false,
    });
  },
};

export default authService;
