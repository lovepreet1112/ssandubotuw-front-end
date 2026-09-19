import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import socketService from '../../services/socketService';
import {
  orderUpdatedRealtime as orderUpdatedUser,
  orderAddedRealtime as orderAddedUser,
  orderDeletedRealtime as orderDeletedUser,
} from '../../redux/slices/orderSlice';
import {
  orderReceivedRealtime as orderReceivedAdmin,
  orderUpdatedRealtime as orderUpdatedAdmin,
  orderDeletedRealtime as orderDeletedAdmin,
  inventoryUpdatedRealtime as inventoryUpdatedAdmin,
  userCreatedRealtime as userCreatedAdmin,
  userUpdatedRealtime as userUpdatedAdmin,
} from '../../redux/slices/adminSlice';
import {
  productCreatedRealtime,
  productUpdatedRealtime,
  productDeletedRealtime,
  inventoryUpdatedRealtime as inventoryUpdatedProduct,
} from '../../redux/slices/productSlice';

/**
 * SocketManager - Headless component managing the centralized Socket.IO
 * connection lifecycle, global real-time event listeners, Redux dispatchers,
 * and elegant notifications without modifying any layout or UI styles.
 */
export const SocketManager = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isAdmin } = useSelector((state) => state.auth);
  const prevAuthRef = useRef(isAuthenticated);

  // 1. Connection lifecycle tied to authentication state
  useEffect(() => {
    const token = localStorage.getItem('sandh_token');
    socketService.connect(token);

    if (prevAuthRef.current && !isAuthenticated) {
      // User logged out
      socketService.disconnect();
    }
    prevAuthRef.current = isAuthenticated;
  }, [isAuthenticated, user]);

  // 2. Global Event Listeners
  useEffect(() => {
    // Handler: New order placed (primarily for admins)
    const handleOrderNew = (data) => {
      const order = data?.order;
      if (!order) return;

      if (isAdmin) {
        toast.success(`🛎️ New Order Received: #${order.orderNumber} (₹${(order.total || 0).toLocaleString('en-IN')})`, {
          duration: 5000,
          id: `order-new-${order._id}`,
        });
        dispatch(orderReceivedAdmin(order));
      }
    };

    // Handler: Order status updated or cancelled
    const handleOrderUpdated = (data) => {
      const order = data?.order;
      if (!order) return;

      const orderUserId = order.user?._id?.toString() || order.user?.toString();
      const currentUserId = user?._id?.toString();

      // If current user is the owner of this order
      if (currentUserId && orderUserId === currentUserId) {
        toast(`📦 Order #${order.orderNumber} status is now: ${order.orderStatus?.toUpperCase()}`, {
          icon: order.orderStatus === 'cancelled' ? '❌' : '✨',
          duration: 4500,
          id: `order-update-${order._id}-${order.orderStatus}`,
        });
        dispatch(orderUpdatedUser(order));
      }

      // If admin, update admin dashboard/orders list without full screen reload
      if (isAdmin) {
        if (order.orderStatus === 'cancelled') {
          toast(`⚠️ Order #${order.orderNumber} has been CANCELLED`, {
            icon: '❌',
            duration: 4500,
            id: `admin-order-cancel-${order._id}`,
          });
        }
        dispatch(orderUpdatedAdmin(data));
      }
    };

    // Handler: Order deleted
    const handleOrderDeleted = (data) => {
      const { orderId } = data || {};
      if (!orderId) return;

      dispatch(orderDeletedUser(orderId));
      if (isAdmin) {
        dispatch(orderDeletedAdmin(orderId));
      }
    };

    // Handler: Product created
    const handleProductCreated = (data) => {
      if (data?.product) {
        dispatch(productCreatedRealtime(data.product));
      }
    };

    // Handler: Product updated
    const handleProductUpdated = (data) => {
      if (data?.product) {
        dispatch(productUpdatedRealtime(data.product));
      }
    };

    // Handler: Product deleted
    const handleProductDeleted = (data) => {
      if (data?.productId) {
        dispatch(productDeletedRealtime(data.productId));
      }
    };

    // Handler: Inventory stock updated
    const handleInventoryUpdated = (data) => {
      if (data?.productId) {
        dispatch(inventoryUpdatedProduct(data));
        if (isAdmin) {
          dispatch(inventoryUpdatedAdmin(data));
        }
      }
    };

    // Handler: User registered (primarily for admins)
    const handleUserCreated = (data) => {
      const newUser = data?.user;
      if (!newUser) return;

      if (isAdmin) {
        toast.success(`👤 New Collector Registered: ${newUser.name}`, {
          duration: 4500,
          id: `user-new-${newUser._id}`,
        });
        dispatch(userCreatedAdmin(newUser));
      }
    };

    // Handler: User profile or status updated
    const handleUserUpdated = (data) => {
      const updatedUser = data?.user;
      if (!updatedUser) return;

      if (isAdmin) {
        dispatch(userUpdatedAdmin(updatedUser));
      }
    };

    // Handler: General notification event
    const handleNotificationNew = (data) => {
      if (!data) return;
      // If notification has a message and hasn't been toasted by specific handler above
      if (
        data.type !== 'order:new' &&
        data.type !== 'order:updated' &&
        data.type !== 'user:created' &&
        data.message
      ) {
        toast(data.message, {
          icon: '🔔',
          duration: 4000,
        });
      }
    };

    // Register all listeners with automatic duplicate prevention
    socketService.on('order:new', handleOrderNew);
    socketService.on('order:updated', handleOrderUpdated);
    socketService.on('order:deleted', handleOrderDeleted);
    socketService.on('product:created', handleProductCreated);
    socketService.on('product:updated', handleProductUpdated);
    socketService.on('product:deleted', handleProductDeleted);
    socketService.on('inventory:updated', handleInventoryUpdated);
    socketService.on('user:created', handleUserCreated);
    socketService.on('user:updated', handleUserUpdated);
    socketService.on('notification:new', handleNotificationNew);

    // Clean up listeners on unmount or re-render
    return () => {
      socketService.off('order:new', handleOrderNew);
      socketService.off('order:updated', handleOrderUpdated);
      socketService.off('order:deleted', handleOrderDeleted);
      socketService.off('product:created', handleProductCreated);
      socketService.off('product:updated', handleProductUpdated);
      socketService.off('product:deleted', handleProductDeleted);
      socketService.off('inventory:updated', handleInventoryUpdated);
      socketService.off('user:created', handleUserCreated);
      socketService.off('user:updated', handleUserUpdated);
      socketService.off('notification:new', handleNotificationNew);
    };
  }, [dispatch, isAdmin, user]);

  return null;
};

export default SocketManager;
