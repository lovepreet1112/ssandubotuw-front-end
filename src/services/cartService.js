import apiRequest from '../helpers/apiRequest';

export const cartService = {
  getCart: async () => {
    return await apiRequest({
      method: 'GET',
      url: '/cart',
      showToast: false,
    });
  },

  addToCart: async ({ productId, quantity = 1, selectedSize = 'M', selectedColor = 'Natural Cream', selectedDesign = 'Original' }) => {
    return await apiRequest({
      method: 'POST',
      url: '/cart',
      data: { productId, quantity, selectedSize, selectedColor, selectedDesign },
      showToast: true,
      successMessage: 'Added to your bag',
    });
  },

  updateCartItem: async (itemId, quantity) => {
    return await apiRequest({
      method: 'PUT',
      url: `/cart/${itemId}`,
      data: { quantity },
      showToast: false,
    });
  },

  removeCartItem: async (itemId) => {
    return await apiRequest({
      method: 'DELETE',
      url: `/cart/${itemId}`,
      showToast: true,
      successMessage: 'Item removed from bag',
    });
  },

  clearCart: async () => {
    return await apiRequest({
      method: 'DELETE',
      url: '/cart',
      showToast: false,
    });
  },
};

export default cartService;
