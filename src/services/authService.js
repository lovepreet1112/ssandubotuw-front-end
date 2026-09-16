import apiRequest from '../helpers/apiRequest';

export const authService = {
  signup: async (userData) => {
    const res = await apiRequest({
      method: 'POST',
      url: '/auth/signup',
      data: userData,
      showToast: true,
      successMessage: 'Welcome to Sandh Boutique! Account created successfully.',
    });
    if (res.data?.token) {
      localStorage.setItem('sandh_token', res.data.token);
    }
    return res;
  },

  login: async (credentials) => {
    const res = await apiRequest({
      method: 'POST',
      url: '/auth/login',
      data: credentials,
      showToast: true,
      successMessage: 'Welcome back to Sandh Boutique!',
    });
    if (res.data?.token) {
      localStorage.setItem('sandh_token', res.data.token);
    }
    return res;
  },

  logout: async () => {
    localStorage.removeItem('sandh_token');
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
