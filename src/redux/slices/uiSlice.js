import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isInitialLoading: true, // Controls the Punjabi welcome loader on first visit
  isMobileNavOpen: false,
  isMobileFilterOpen: false,
  activeModal: null, // 'quickView', 'addressForm', 'cancelOrder', etc.
  modalData: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    finishInitialLoading: (state) => {
      state.isInitialLoading = false;
    },
    toggleMobileNav: (state) => {
      state.isMobileNavOpen = !state.isMobileNavOpen;
    },
    closeMobileNav: (state) => {
      state.isMobileNavOpen = false;
    },
    toggleMobileFilter: (state) => {
      state.isMobileFilterOpen = !state.isMobileFilterOpen;
    },
    openModal: (state, action) => {
      state.activeModal = action.payload.modal;
      state.modalData = action.payload.data || null;
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.modalData = null;
    },
  },
});

export const {
  finishInitialLoading,
  toggleMobileNav,
  closeMobileNav,
  toggleMobileFilter,
  openModal,
  closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;
