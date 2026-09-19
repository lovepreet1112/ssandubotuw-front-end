import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { TableLoader, TableEmpty } from '../components/common/Loader';
import { Eye, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';
import socketService from '../services/socketService';

const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
  'cancelled',
];

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditStatusModal, setIsEditStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllOrders(statusFilter);
      if (res.data?.orders) setOrders(res.data.orders);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  useEffect(() => {
    const handleNewOrder = (data) => {
      const order = data?.order;
      if (!order) return;
      setOrders((prev) => {
        if (statusFilter !== 'all' && order.orderStatus !== statusFilter) {
          return prev;
        }
        if (prev.some((o) => o._id === order._id)) return prev;
        return [order, ...prev];
      });
    };

    const handleOrderUpdated = (data) => {
      const order = data?.order;
      if (!order) return;
      setOrders((prev) =>
        prev
          .map((o) => {
            if (o._id === order._id) {
              const mergedUser = typeof order.user === 'object' && order.user !== null ? order.user : o.user;
              return { ...o, ...order, user: mergedUser };
            }
            return o;
          })
          .filter((o) => statusFilter === 'all' || o.orderStatus === statusFilter)
      );
    };

    const handleOrderDeleted = (data) => {
      const { orderId } = data || {};
      if (!orderId) return;
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    };

    socketService.on('order:new', handleNewOrder);
    socketService.on('order:updated', handleOrderUpdated);
    socketService.on('order:deleted', handleOrderDeleted);

    return () => {
      socketService.off('order:new', handleNewOrder);
      socketService.off('order:updated', handleOrderUpdated);
      socketService.off('order:deleted', handleOrderDeleted);
    };
  }, [statusFilter]);

  const handleOpenStatusEdit = (ord) => {
    setSelectedOrder(ord);
    setNewStatus(ord.orderStatus);
    setCancelReason('');
    setIsEditStatusModal(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      setIsUpdating(true);
      await adminService.updateOrderStatus(selectedOrder._id, newStatus, cancelReason);
      setIsEditStatusModal(false);
      setSelectedOrder(null);
      loadOrders();
    } catch (err) {
      // Handled
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2A2923]">Orders Dispatch Management</h1>
          <p className="text-xs text-[#686558] mt-0.5">
            Manage dispatch progression and review collector addresses.
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs bg-white border border-[#DDCBA4] rounded-sm px-3 py-2 text-[#2A2923] focus:outline-none cursor-pointer"
        >
          <option value="all">All Orders</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-[#DDCBA4]/60 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAEDCD]/40 text-[#2A2923] uppercase font-semibold border-b border-[#DDCBA4]/50">
              <tr>
                <th className="p-3">Order #</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Items</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDCBA4]/30 text-[#2A2923]">
              {loading ? (
                <TableLoader colSpan={8} message="Fetching dispatch orders..." />
              ) : orders.length === 0 ? (
                <TableEmpty colSpan={8} message="No customer orders found" />
              ) : (
                orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-[#FAEDCD]/20">
                    <td className="p-3 font-mono font-medium">{ord.orderNumber}</td>
                    <td className="p-3">
                      <div>
                        <p className="font-semibold text-[#2A2923]">
                          {ord.user?.name || ord.shippingAddress?.fullName}
                        </p>
                        <p className="text-[11px] text-[#686558]">{ord.shippingAddress?.phone}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-[#686558]">
                        {ord.items.length} items ({ord.items.reduce((s, i) => s + i.quantity, 0)} pcs)
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-[#D4A373]">
                      ₹{ord.total.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3">
                      <Badge variant={ord.paymentInfo?.status || 'pending'}>
                        {ord.paymentInfo?.status || 'pending'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant={ord.orderStatus}>{ord.orderStatus.replace('_', ' ')}</Badge>
                    </td>
                    <td className="p-3 text-[#686558]">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <button
                        onClick={() => handleOpenStatusEdit(ord)}
                        className="p-1 text-[#686558] hover:text-[#D4A373]"
                        title="Update Order Status"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Order Status Modal */}
      {isEditStatusModal && selectedOrder && (
        <Modal
          isOpen={isEditStatusModal}
          onClose={() => setIsEditStatusModal(false)}
          title={`Manage Order #${selectedOrder.orderNumber}`}
          subtitle={`Current Status: ${selectedOrder.orderStatus}`}
        >
          <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-[#2A2923] block mb-1">
                Progress Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373] capitalize"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {newStatus === 'cancelled' && (
              <div>
                <label className="font-semibold text-[#2A2923] block mb-1">
                  Reason for Admin Cancellation
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={2}
                  placeholder="E.g., Out of yarn stock, client address unverified..."
                  className="w-full p-2 bg-white border border-[#DDCBA4] rounded-sm"
                />
              </div>
            )}

            <div className="p-3 bg-[#E9EDC9]/40 border border-[#CCD5AE] rounded-sm space-y-1">
              <p className="font-semibold text-[#2A2923]">Delivery Details:</p>
              <p>{selectedOrder.shippingAddress?.fullName} ({selectedOrder.shippingAddress?.phone})</p>
              <p>{selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}</p>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#DDCBA4]/40">
              <Button variant="warm" size="sm" onClick={() => setIsEditStatusModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isUpdating} disabled={isUpdating}>
                Save Status Transition
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminOrdersPage;
