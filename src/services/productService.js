import apiRequest from '../helpers/apiRequest';

export const productService = {
  getProducts: async (filters = {}) => {
    return await apiRequest({
      method: 'GET',
      url: '/products',
      params: filters,
      showToast: false,
    });
  },

  getProductById: async (id) => {
    return await apiRequest({
      method: 'GET',
      url: `/products/${id}`,
      showToast: false,
    });
  },

  createProduct: async (productData) => {
    return await apiRequest({
      method: 'POST',
      url: '/products',
      data: productData,
      showToast: true,
      successMessage: 'Product created successfully',
    });
  },

  updateProduct: async (id, updateData) => {
    return await apiRequest({
      method: 'PUT',
      url: `/products/${id}`,
      data: updateData,
      showToast: true,
      successMessage: 'Product updated successfully',
    });
  },

  deleteProduct: async (id) => {
    return await apiRequest({
      method: 'DELETE',
      url: `/products/${id}`,
      showToast: true,
      successMessage: 'Product removed from collection',
    });
  },
};

export default productService;
