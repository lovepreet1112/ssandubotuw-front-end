import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../services/productService';

export const executeSearch = createAsyncThunk(
  'search/executeSearch',
  async (query, { rejectWithValue }) => {
    try {
      if (!query || query.trim() === '') {
        return [];
      }
      const response = await productService.getProducts({ search: query, limit: 6 });
      return response.data.products;
    } catch (err) {
      return rejectWithValue(err.message || 'Search failed');
    }
  }
);

const initialState = {
  query: '',
  liveResults: [],
  isSearching: false,
  isDropdownOpen: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload;
      if (!action.payload.trim()) {
        state.liveResults = [];
        state.isDropdownOpen = false;
      }
    },
    setDropdownOpen: (state, action) => {
      state.isDropdownOpen = action.payload;
    },
    clearSearch: (state) => {
      state.query = '';
      state.liveResults = [];
      state.isDropdownOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(executeSearch.pending, (state) => {
        state.isSearching = true;
      })
      .addCase(executeSearch.fulfilled, (state, action) => {
        state.liveResults = action.payload;
        state.isSearching = false;
        state.isDropdownOpen = action.payload.length > 0;
      })
      .addCase(executeSearch.rejected, (state) => {
        state.isSearching = false;
      });
  },
});

export const { setSearchQuery, setDropdownOpen, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
