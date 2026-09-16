import apiRequest from '../helpers/apiRequest';

export const orderService = {
  createOrder: async (orderPayload) => {
    return await apiRequest({
      method: 'POST',
      url: '/orders',
      data: orderPayload,
      showToast: true,
      successMessage: 'Your order has been placed successfully!',
    });
  },

  getMyOrders: async (status = 'all') => {
    return await apiRequest({
      method: 'GET',
      url: '/orders/my',
      params: { status },
      showToast: false,
    });
  },

  getOrderById: async (orderId) => {
    return await apiRequest({
      method: 'GET',
      url: `/orders/${orderId}`,
      showToast: false,
    });
  },

  cancelOrder: async (orderId, reason) => {
    return await apiRequest({
      method: 'PUT',
      url: `/orders/${orderId}/cancel`,
      data: { reason },
      showToast: true,
      successMessage: 'Order cancelled successfully',
    });
  },
};

export default orderService;
