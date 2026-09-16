import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../../services/cartService';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await cartService.getCart();
    return response.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch cart');
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (itemData, { rejectWithValue }) => {
  try {
    const response = await cartService.addToCart(itemData);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to add item to cart');
  }
});

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartService.updateCartItem(itemId, quantity);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update cart');
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await cartService.removeCartItem(itemId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to remove item');
    }
  }
);

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
  try {
    const response = await cartService.clearCart();
    return response.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to clear cart');
  }
});

const initialState = {
  cart: { items: [] },
  summary: {
    subtotal: 0,
    discount: 0,
    shipping: 0,
    total: 0,
    itemCount: 0,
  },
  loading: false,
  isDrawerOpen: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    toggleCartDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    openCartDrawer: (state) => {
      state.isDrawerOpen = true;
    },
    closeCartDrawer: (state) => {
      state.isDrawerOpen = false;
    },
    resetCartState: (state) => {
      state.cart = { items: [] };
      state.summary = { subtotal: 0, discount: 0, shipping: 0, total: 0, itemCount: 0 };
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload.cart;
        state.summary = action.payload.summary;
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // addToCart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload.cart;
        state.summary = action.payload.summary;
        state.loading = false;
        state.isDrawerOpen = true; // Open drawer smoothly on add
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateCartItem
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cart = action.payload.cart;
        state.summary = action.payload.summary;
      })
      // removeCartItem
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.cart = action.payload.cart;
        state.summary = action.payload.summary;
      })
      // clearCart
      .addCase(clearCart.fulfilled, (state, action) => {
        state.cart = action.payload.cart;
        state.summary = action.payload.summary;
      });
  },
});

export const { toggleCartDrawer, openCartDrawer, closeCartDrawer, resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
