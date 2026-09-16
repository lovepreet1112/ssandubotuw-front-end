import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from '../../services/adminService';

export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.getDashboardStats();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load dashboard stats');
    }
  }
);

export const fetchAdminUsers = createAsyncThunk('admin/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await adminService.getUsers();
    return response.data.users;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch users');
  }
});

export const fetchInventory = createAsyncThunk('admin/fetchInventory', async (_, { rejectWithValue }) => {
  try {
    const response = await adminService.getInventory();
    return response.data.inventory;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch inventory');
  }
});

export const fetchAdminOrders = createAsyncThunk(
  'admin/fetchOrders',
  async (status, { rejectWithValue }) => {
    try {
      const response = await adminService.getAllOrders(status);
      return response.data.orders;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch orders');
    }
  }
);

export const updateAdminOrderStatus = createAsyncThunk(
  'admin/updateOrderStatus',
  async ({ orderId, status, cancellationReason }, { rejectWithValue }) => {
    try {
      const response = await adminService.updateOrderStatus(orderId, status, cancellationReason);
      return response.data.order;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update order status');
    }
  }
);

export const fetchAdminPayments = createAsyncThunk(
  'admin/fetchPayments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.getAllPayments();
      return response.data.payments;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch payments');
    }
  }
);

export const fetchAdminReviews = createAsyncThunk(
  'admin/fetchReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.getAllReviews();
      return response.data.reviews;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch reviews');
    }
  }
);

export const toggleReviewApproval = createAsyncThunk(
  'admin/toggleReviewApproval',
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await adminService.toggleReviewApproval(reviewId);
      return response.data.review;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to toggle review approval');
    }
  }
);

export const fetchAdminContacts = createAsyncThunk(
  'admin/fetchContacts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.getContacts();
      return response.data.contacts;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch contact inquiries');
    }
  }
);

export const fetchAdminSubscribers = createAsyncThunk(
  'admin/fetchSubscribers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminService.getSubscribers();
      return response.data.subscribers;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch subscribers');
    }
  }
);

const initialState = {
  stats: null,
  charts: {
    salesChartData: [],
    categoryDistribution: [],
    orderStatusBreakdown: [],
  },
  recentOrders: [],
  users: [],
  inventory: [],
  orders: [],
  payments: [],
  reviews: [],
  contacts: [],
  subscribers: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Dashboard stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.stats = action.payload.stats;
        state.charts = action.payload.charts;
        state.recentOrders = action.payload.recentOrders;
        state.loading = false;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Users
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      // Inventory
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.inventory = action.payload;
      })
      // Orders
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(updateAdminOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex((o) => o._id === action.payload._id);
        if (index > -1) {
          state.orders[index] = action.payload;
        }
      })
      // Payments
      .addCase(fetchAdminPayments.fulfilled, (state, action) => {
        state.payments = action.payload;
      })
      // Reviews
      .addCase(fetchAdminReviews.fulfilled, (state, action) => {
        state.reviews = action.payload;
      })
      .addCase(toggleReviewApproval.fulfilled, (state, action) => {
        const index = state.reviews.findIndex((r) => r._id === action.payload._id);
        if (index > -1) {
          state.reviews[index] = action.payload;
        }
      })
      // Contacts
      .addCase(fetchAdminContacts.fulfilled, (state, action) => {
        state.contacts = action.payload;
      })
      // Subscribers
      .addCase(fetchAdminSubscribers.fulfilled, (state, action) => {
        state.subscribers = action.payload;
      });
  },
});

export default adminSlice.reducer;
