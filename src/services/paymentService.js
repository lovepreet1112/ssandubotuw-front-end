import apiRequest from '../helpers/apiRequest';

export const paymentService = {
  createPaymentOrder: async (amount) => {
    return await apiRequest({
      method: 'POST',
      url: '/payment/create',
      data: { amount },
      showToast: false,
    });
  },

  verifyPayment: async (paymentData) => {
    return await apiRequest({
      method: 'POST',
      url: '/payment/verify',
      data: paymentData,
      showToast: true,
      successMessage: 'Payment verified successfully!',
    });
  },

  getPaymentById: async (id) => {
    return await apiRequest({
      method: 'GET',
      url: `/payment/${id}`,
      showToast: false,
    });
  },
};

export default paymentService;
