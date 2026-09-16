import apiRequest from '../helpers/apiRequest';

export const userService = {
  getProfile: async () => {
    return await apiRequest({
      method: 'GET',
      url: '/users/profile',
      showToast: false,
    });
  },

  updateProfile: async (userData) => {
    return await apiRequest({
      method: 'PUT',
      url: '/users/profile',
      data: userData,
      showToast: true,
      successMessage: 'Profile updated successfully',
    });
  },

  changePassword: async (passwords) => {
    return await apiRequest({
      method: 'PUT',
      url: '/users/change-password',
      data: passwords,
      showToast: true,
      successMessage: 'Password updated successfully',
    });
  },
};

export default userService;
