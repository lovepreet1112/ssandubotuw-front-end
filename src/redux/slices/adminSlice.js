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
  reducers: {
    orderReceivedRealtime: (state, action) => {
      const order = action.payload;
      if (!order || !order._id) return;
      const orderIdStr = order._id?.toString() || order._id;

      // Add to orders list if not already present
      if (!state.orders.some((o) => (o._id?.toString() || o._id) === orderIdStr)) {
        state.orders.unshift(order);
      }

      // Update recent orders (keep top 5)
      if (!state.recentOrders.some((o) => (o._id?.toString() || o._id) === orderIdStr)) {
        state.recentOrders = [order, ...state.recentOrders.slice(0, 4)];
      }

      // Update aggregate metrics if stats are loaded
      if (state.stats) {
        state.stats.totalOrders = (state.stats.totalOrders || 0) + 1;
        state.stats.totalRevenue = (state.stats.totalRevenue || 0) + (Number(order.total) || 0);
        if (order.orderStatus === 'pending') {
          state.stats.pendingOrders = (state.stats.pendingOrders || 0) + 1;
        } else {
          state.stats.processingOrders = (state.stats.processingOrders || 0) + 1;
        }
      }

      // Increment orders count on the user's record if users list is loaded
      const orderUserId = order.user?._id?.toString() || order.user?.toString();
      if (orderUserId && state.users && state.users.length > 0) {
        state.users = state.users.map((u) =>
          (u._id?.toString() || u._id) === orderUserId
            ? { ...u, totalOrders: (u.totalOrders || 0) + 1 }
            : u
        );
      }

      // Real-time update to charts.orderStatusBreakdown for newly received order
      if (state.charts?.orderStatusBreakdown) {
        const statusLabel = order.orderStatus === 'pending' ? 'Pending' : 'Processing';
        let found = false;
        state.charts.orderStatusBreakdown = state.charts.orderStatusBreakdown.map((item) => {
          if (item.name.toLowerCase() === statusLabel.toLowerCase()) {
            found = true;
            return { ...item, value: item.value + 1 };
          }
          return item;
        });
        if (!found) {
          state.charts.orderStatusBreakdown.push({
            name: statusLabel,
            value: 1,
            color: statusLabel === 'Pending' ? '#FAEDCD' : '#D4A373',
          });
        }
      }
    },
    orderUpdatedRealtime: (state, action) => {
      const payload = action.payload;
      const order = payload?.order || payload;
      if (!order || !order._id) return;
      const orderIdStr = order._id?.toString() || order._id;

      const existingOrder =
        state.orders.find((o) => (o._id?.toString() || o._id) === orderIdStr) ||
        state.recentOrders.find((o) => (o._id?.toString() || o._id) === orderIdStr);

      let oldStatus = payload?.previousStatus || existingOrder?.orderStatus;
      const newStatus = order.orderStatus;

      // Fallback: If order is cancelled and oldStatus is unknown, assume it was processing
      if (!oldStatus && newStatus === 'cancelled') {
        oldStatus = 'processing';
      }

      // Update in orders list
      const idx = state.orders.findIndex((o) => (o._id?.toString() || o._id) === orderIdStr);
      if (idx > -1) {
        state.orders[idx] = { ...state.orders[idx], ...order };
      }

      // Update in recentOrders list
      const recentIdx = state.recentOrders.findIndex((o) => (o._id?.toString() || o._id) === orderIdStr);
      if (recentIdx > -1) {
        state.recentOrders[recentIdx] = { ...state.recentOrders[recentIdx], ...order };
      }

      // Update stats and counters in real time
      if (state.stats && oldStatus && oldStatus !== newStatus) {
        // Decrement old status count
        if (oldStatus === 'pending') {
          state.stats.pendingOrders = Math.max(0, (state.stats.pendingOrders || 0) - 1);
        } else if (oldStatus === 'confirmed' || oldStatus === 'processing') {
          state.stats.processingOrders = Math.max(0, (state.stats.processingOrders || 0) - 1);
        } else if (oldStatus === 'shipped') {
          state.stats.shippedOrders = Math.max(0, (state.stats.shippedOrders || 0) - 1);
        } else if (oldStatus === 'delivered') {
          state.stats.deliveredOrders = Math.max(0, (state.stats.deliveredOrders || 0) - 1);
        } else if (oldStatus === 'cancelled') {
          state.stats.cancelledOrders = Math.max(0, (state.stats.cancelledOrders || 0) - 1);
        }

        // Increment new status count
        if (newStatus === 'cancelled') {
          state.stats.cancelledOrders = (state.stats.cancelledOrders || 0) + 1;
          if (oldStatus !== 'cancelled') {
            state.stats.totalRevenue = Math.max(0, (state.stats.totalRevenue || 0) - (Number(order.total) || 0));
          }
        } else if (newStatus === 'confirmed' || newStatus === 'processing') {
          state.stats.processingOrders = (state.stats.processingOrders || 0) + 1;
        } else if (newStatus === 'pending') {
          state.stats.pendingOrders = (state.stats.pendingOrders || 0) + 1;
        } else if (newStatus === 'shipped') {
          state.stats.shippedOrders = (state.stats.shippedOrders || 0) + 1;
        } else if (newStatus === 'delivered') {
          state.stats.deliveredOrders = (state.stats.deliveredOrders || 0) + 1;
        }

        // Real-time update to charts.orderStatusBreakdown (case & spelling resilient)
        if (state.charts?.orderStatusBreakdown) {
          const mapToLabel = {
            delivered: 'Delivered',
            processing: 'Processing',
            confirmed: 'Processing',
            pending: 'Pending',
            shipped: 'Shipped',
            cancelled: 'Cancelled',
          };
          const oldLabel = mapToLabel[oldStatus];
          const newLabel = mapToLabel[newStatus];

          let matchedNew = false;
          state.charts.orderStatusBreakdown = state.charts.orderStatusBreakdown
            .map((item) => {
              const nameLower = (item.name || '').toLowerCase();
              const isOldMatch =
                oldLabel &&
                (nameLower === oldLabel.toLowerCase() ||
                  (oldLabel === 'Cancelled' && nameLower.startsWith('cancel')));
              const isNewMatch =
                newLabel &&
                (nameLower === newLabel.toLowerCase() ||
                  (newLabel === 'Cancelled' && nameLower.startsWith('cancel')));

              if (isOldMatch) {
                return { ...item, value: Math.max(0, item.value - 1) };
              }
              if (isNewMatch) {
                matchedNew = true;
                return { ...item, value: item.value + 1 };
              }
              return item;
            })
            .filter((item) => item.value > 0);

          if (newLabel && !matchedNew) {
            const colors = {
              Delivered: '#CCD5AE',
              Processing: '#D4A373',
              Pending: '#FAEDCD',
              Shipped: '#E9EDC9',
              Cancelled: '#C86D51',
            };
            state.charts.orderStatusBreakdown.push({
              name: newLabel,
              value: 1,
              color: colors[newLabel] || '#D4A373',
            });
          }
        }
      }
    },
    orderDeletedRealtime: (state, action) => {
      const orderId = action.payload;
      state.orders = state.orders.filter((o) => o._id !== orderId);
      state.recentOrders = state.recentOrders.filter((o) => o._id !== orderId);
      if (state.stats && state.stats.totalOrders > 0) {
        state.stats.totalOrders -= 1;
      }
    },
    inventoryUpdatedRealtime: (state, action) => {
      const { productId, stock, isAvailable } = action.payload || {};
      if (!productId) return;

      state.inventory = state.inventory.map((item) =>
        item._id === productId
          ? {
              ...item,
              stock: stock !== undefined ? stock : item.stock,
              isAvailable: isAvailable !== undefined ? isAvailable : item.isAvailable,
            }
          : item
      );
    },
    userCreatedRealtime: (state, action) => {
      const user = action.payload;
      if (!user || !user._id) return;

      if (!state.users.some((u) => u._id === user._id)) {
        state.users.unshift({
          ...user,
          totalOrders: user.totalOrders || 0,
        });
      }

      if (state.stats) {
        state.stats.totalUsers = (state.stats.totalUsers || 0) + 1;
      }
    },
    userUpdatedRealtime: (state, action) => {
      const user = action.payload;
      if (!user || !user._id) return;

      state.users = state.users.map((u) =>
        u._id === user._id ? { ...u, ...user } : u
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard stats
      .addCase(fetchDashboardStats.pending, (state) => {
        if (!state.stats) {
          state.loading = true;
        }
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

export const {
  orderReceivedRealtime,
  orderUpdatedRealtime,
  orderDeletedRealtime,
  inventoryUpdatedRealtime,
  userCreatedRealtime,
  userUpdatedRealtime,
} = adminSlice.actions;

export default adminSlice.reducer;
