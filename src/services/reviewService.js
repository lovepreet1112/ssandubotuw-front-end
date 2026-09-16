import apiRequest from '../helpers/apiRequest';

export const reviewService = {
  getProductReviews: async (productId) => {
    return await apiRequest({
      method: 'GET',
      url: `/reviews/product/${productId}`,
      showToast: false,
    });
  },

  createReview: async ({ productId, rating, comment }) => {
    return await apiRequest({
      method: 'POST',
      url: '/reviews',
      data: { productId, rating, comment },
      showToast: true,
      successMessage: 'Thank you for your review!',
    });
  },

  deleteReview: async (reviewId) => {
    return await apiRequest({
      method: 'DELETE',
      url: `/reviews/${reviewId}`,
      showToast: true,
      successMessage: 'Review deleted',
    });
  },
};

export default reviewService;
