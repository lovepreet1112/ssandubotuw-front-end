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
      const response = await productService.getProducts({ isNewArrival: true, sort: 'newest', limit: 8 });
      let products = response.data.products || [];
      if (products.length === 0) {
        const fallbackRes = await productService.getProducts({ sort: 'newest', limit: 8 });
        products = fallbackRes.data.products || [];
      }
      return products;
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
    productCreatedRealtime: (state, action) => {
      const product = action.payload;
      if (!product || !product._id) return;
      if (!state.products.some((p) => p._id === product._id)) {
        state.products.unshift(product);
      }
      if (product.isFeatured && !state.featuredProducts.some((p) => p._id === product._id)) {
        state.featuredProducts.unshift(product);
      }
      // Place newly added atelier product at the very top of latest / newArrivals
      if (!state.newArrivals.some((p) => p._id === product._id)) {
        state.newArrivals.unshift(product);
      }
    },
    productUpdatedRealtime: (state, action) => {
      const product = action.payload;
      if (!product || !product._id) return;

      const updateList = (list) =>
        list.map((p) => (p._id === product._id ? { ...p, ...product } : p));

      state.products = updateList(state.products);
      state.featuredProducts = updateList(state.featuredProducts);
      state.newArrivals = updateList(state.newArrivals);

      if (state.currentProduct?._id === product._id) {
        state.currentProduct = { ...state.currentProduct, ...product };
      }
    },
    productDeletedRealtime: (state, action) => {
      const productId = action.payload;
      if (!productId) return;

      const filterList = (list) => list.filter((p) => p._id !== productId);

      state.products = filterList(state.products);
      state.featuredProducts = filterList(state.featuredProducts);
      state.newArrivals = filterList(state.newArrivals);

      if (state.currentProduct?._id === productId) {
        state.currentProduct = null;
      }
    },
    inventoryUpdatedRealtime: (state, action) => {
      const { productId, stock, isAvailable } = action.payload || {};
      if (!productId) return;

      const updateStock = (p) =>
        p._id === productId
          ? {
              ...p,
              stock: stock !== undefined ? stock : p.stock,
              isAvailable: isAvailable !== undefined ? isAvailable : p.isAvailable,
            }
          : p;

      state.products = state.products.map(updateStock);
      state.featuredProducts = state.featuredProducts.map(updateStock);
      state.newArrivals = state.newArrivals.map(updateStock);

      if (state.currentProduct?._id === productId) {
        state.currentProduct = updateStock(state.currentProduct);
      }
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

export const {
  clearCurrentProduct,
  productCreatedRealtime,
  productUpdatedRealtime,
  productDeletedRealtime,
  inventoryUpdatedRealtime,
} = productSlice.actions;

export default productSlice.reducer;
