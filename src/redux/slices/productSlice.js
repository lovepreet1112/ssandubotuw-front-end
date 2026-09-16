import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../services/productService';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts(filters);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  'products/fetchProductDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(id);
      return response.data.product;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch product details');
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts({ featured: true, limit: 8 });
      return response.data.products;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch featured products');
    }
  }
);

export const fetchNewArrivals = createAsyncThunk(
  'products/fetchNewArrivals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts({ isNewArrival: true, limit: 8 });
      return response.data.products;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch new arrivals');
    }
  }
);

const initialState = {
  products: [],
  featuredProducts: [],
  newArrivals: [],
  currentProduct: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  },
  loading: false,
  detailsLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchProductDetails
      .addCase(fetchProductDetails.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.currentProduct = action.payload;
        state.detailsLoading = false;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload;
      })
      // fetchFeaturedProducts
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload;
      })
      // fetchNewArrivals
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.newArrivals = action.payload;
      });
  },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
