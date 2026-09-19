import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderPayload, { rejectWithValue }) => {
    try {
      const response = await orderService.createOrder(orderPayload);
      return response.data.order;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to place order');
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (status, { rejectWithValue }) => {
    try {
      const response = await orderService.getMyOrders(status);
      return response.data.orders;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchOrderDetails',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrderById(orderId);
      return response.data.order;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch order details');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async ({ orderId, reason }, { rejectWithValue }) => {
    try {
      const response = await orderService.cancelOrder(orderId, reason);
      return response.data.order;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to cancel order');
    }
  }
);

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    orderUpdatedRealtime: (state, action) => {
      const updated = action.payload;
      if (!updated || !updated._id) return;
      const index = state.orders.findIndex((o) => o._id === updated._id);
      if (index > -1) {
        state.orders[index] = { ...state.orders[index], ...updated };
      }
      if (state.currentOrder?._id === updated._id) {
        state.currentOrder = { ...state.currentOrder, ...updated };
      }
    },
    orderAddedRealtime: (state, action) => {
      const newOrder = action.payload;
      if (!newOrder || !newOrder._id) return;
      if (!state.orders.some((o) => o._id === newOrder._id)) {
        state.orders.unshift(newOrder);
      }
    },
    orderDeletedRealtime: (state, action) => {
      const orderId = action.payload;
      state.orders = state.orders.filter((o) => o._id !== orderId);
      if (state.currentOrder?._id === orderId) {
        state.currentOrder = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
        state.currentOrder = action.payload;
        state.loading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchMyOrders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchOrderDetails
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      // cancelOrder
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex((o) => o._id === action.payload._id);
        if (index > -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      });
  },
});

export const {
  clearCurrentOrder,
  orderUpdatedRealtime,
  orderAddedRealtime,
  orderDeletedRealtime,
} = orderSlice.actions;
export default orderSlice.reducer;
