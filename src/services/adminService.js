import apiRequest from '../helpers/apiRequest';

export const adminService = {
  getDashboardStats: async () => {
    return await apiRequest({
      method: 'GET',
      url: '/admin/dashboard',
      showToast: false,
    });
  },

  getUsers: async () => {
    return await apiRequest({
      method: 'GET',
      url: '/admin/users',
      showToast: false,
    });
  },

  updateUser: async (userId, data) => {
    return await apiRequest({
      method: 'PUT',
      url: `/admin/users/${userId}`,
      data,
      showToast: true,
      successMessage: 'User updated successfully',
    });
  },

  getInventory: async () => {
    return await apiRequest({
      method: 'GET',
      url: '/admin/inventory',
      showToast: false,
    });
  },

  getAllOrders: async (status = 'all') => {
    return await apiRequest({
      method: 'GET',
      url: '/admin/orders',
      params: { status },
      showToast: false,
    });
  },

  updateOrderStatus: async (orderId, status, cancellationReason = '') => {
    return await apiRequest({
      method: 'PUT',
      url: `/admin/orders/${orderId}/status`,
      data: { status, cancellationReason },
      showToast: true,
      successMessage: 'Order status updated successfully',
    });
  },

  getAllPayments: async () => {
    return await apiRequest({
      method: 'GET',
      url: '/admin/payments',
      showToast: false,
    });
  },

  getAllReviews: async () => {
    return await apiRequest({
      method: 'GET',
      url: '/admin/reviews',
      showToast: false,
    });
  },

  toggleReviewApproval: async (reviewId) => {
    return await apiRequest({
      method: 'PUT',
      url: `/admin/reviews/${reviewId}/approval`,
      showToast: true,
      successMessage: 'Review approval status updated',
    });
  },

  getContacts: async () => {
    return await apiRequest({
      method: 'GET',
      url: '/contact',
      showToast: false,
    });
  },

  updateContactStatus: async (contactId, status) => {
    return await apiRequest({
      method: 'PUT',
      url: `/contact/${contactId}`,
      data: { status },
      showToast: true,
      successMessage: 'Inquiry status updated',
    });
  },

  getSubscribers: async () => {
    return await apiRequest({
      method: 'GET',
      url: '/newsletter/subscribers',
      showToast: false,
    });
  },
};

export default adminService;
