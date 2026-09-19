import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://sandhubtiq-backen.vercel.app/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enables HTTP-only cookies transmission
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage if available (supports cross-site cookie restrictions)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('sandh_token');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


/**
 * Reusable Centralized API Request Helper
 * @param {Object} options
 * @param {'GET'|'POST'|'PUT'|'DELETE'|'PATCH'} [options.method='GET']
 * @param {string} options.url
 * @param {Object} [options.params]
 * @param {Object} [options.data]
 * @param {Object} [options.headers]
 * @param {boolean} [options.showToast=false]
 * @param {string} [options.successMessage]
 */
export const apiRequest = async ({
  method = 'GET',
  url,
  params = {},
  data = null,
  headers = {},
  showToast = false,
  successMessage,
}) => {
  try {
    const config = {
      method: method.toUpperCase(),
      url,
      params,
      headers,
    };

    if (data) {
      // Check if FormData or normal JSON
      if (data instanceof FormData) {
        config.data = data;
        config.headers['Content-Type'] = 'multipart/form-data';
      } else {
        config.data = data;
      }
    }

    const response = await axiosInstance(config);

    if (showToast && (successMessage || response.data?.message)) {
      toast.success(successMessage || response.data.message);
    }

    return response.data;
  } catch (error) {
    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';

    // Show error toast only when explicit error handling is needed or non-silent
    if (showToast || error.response?.status >= 500) {
      toast.error(errorMsg);
    }

    throw error.response?.data || { success: false, message: errorMsg };
  }
};

export default apiRequest;
