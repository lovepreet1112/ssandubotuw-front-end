import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  category: 'All',
  subcategory: '',
  minPrice: '',
  maxPrice: '',
  size: 'All',
  color: 'All',
  design: '',
  availability: false,
  featured: false,
  upcoming: false,
  isNewArrival: false,
  sort: 'newest',
  page: 1,
  limit: 12,
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
      state.page = 1;
    },
    setPriceRange: (state, action) => {
      state.minPrice = action.payload.min;
      state.maxPrice = action.payload.max;
      state.page = 1;
    },
    setSize: (state, action) => {
      state.size = action.payload;
      state.page = 1;
    },
    setColor: (state, action) => {
      state.color = action.payload;
      state.page = 1;
    },
    setDesign: (state, action) => {
      state.design = action.payload;
      state.page = 1;
    },
    setAvailability: (state, action) => {
      state.availability = action.payload;
      state.page = 1;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    resetFilters: () => initialState,
  },
});

export const {
  setCategory,
  setPriceRange,
  setSize,
  setColor,
  setDesign,
  setAvailability,
  setSort,
  setPage,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
