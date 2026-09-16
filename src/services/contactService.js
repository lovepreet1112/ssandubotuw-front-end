import apiRequest from '../helpers/apiRequest';

export const contactService = {
  submitContact: async (formData) => {
    return await apiRequest({
      method: 'POST',
      url: '/contact',
      data: formData,
      showToast: true,
      successMessage: 'Thank you! Your inquiry has been sent to our atelier team.',
    });
  },

  subscribeNewsletter: async (email) => {
    return await apiRequest({
      method: 'POST',
      url: '/newsletter/subscribe',
      data: { email },
      showToast: true,
      successMessage: 'Welcome to the Sandh Boutique circle!',
    });
  },
};

export default contactService;
