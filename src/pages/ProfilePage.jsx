import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  User,
  Package,
  KeyRound,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Eye,
  EyeOff,
  AlertTriangle,
  Edit3,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { fetchUserProfile, updateUserProfile } from '../redux/slices/userSlice';
import { fetchMyOrders, cancelOrder } from '../redux/slices/orderSlice';
import userService from '../services/userService';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import toast from 'react-hot-toast';

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders, loading: ordersLoading } = useSelector((state) => state.orders);

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile' | 'security'
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Edit Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
    country: user?.country || 'India',
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Security / Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Selected Order Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchMyOrders(orderStatusFilter));
  }, [orderStatusFilter, dispatch]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
        country: user.country || 'India',
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUpdatingProfile(true);
      await dispatch(updateUserProfile(profileForm));
      toast.success('Atelier profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setIsChangingPassword(true);
      await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      // Handled by apiRequest toast
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!selectedOrder) return;
    try {
      setIsCancelling(true);
      await dispatch(
        cancelOrder({
          orderId: selectedOrder._id,
          reason: cancelReason || 'Customer requested cancellation',
        })
      ).unwrap();
      toast.success('Order has been successfully cancelled');
      setIsCancelModalOpen(false);
      setSelectedOrder(null);
      setCancelReason('');
      dispatch(fetchMyOrders(orderStatusFilter));
    } catch (err) {
      toast.error(typeof err === 'string' ? err : err?.message || 'Failed to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCancelOrder = handleConfirmCancel;

  const statusTabs = [
    { label: 'All Orders', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  return (
    <div className="py-10 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header Profile Summary */}
      <div className="bg-[#FAEDCD]/40 p-6 md:p-8 border border-[#DDCBA4] rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left flex-wrap sm:flex-nowrap justify-center sm:justify-start">
          <div className="w-16 h-16 rounded-full bg-[#E9EDC9] border-2 border-[#D4A373] text-[#2A2923] font-serif text-2xl font-bold flex items-center justify-center shrink-0 shadow-xs">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-serif text-2xl font-bold text-[#2A2923]">{user?.name}</h1>
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#D4A373] hover:text-white bg-white hover:bg-[#D4A373] border border-[#DDCBA4] hover:border-[#D4A373] rounded-sm transition-all shadow-xs"
                title="Edit your name, phone, and address details"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit User Details</span>
              </button>
            </div>
            <p className="text-xs text-[#686558]">{user?.email}</p>
            <p className="text-[11px] text-[#D4A373] font-medium">
              Collector at Sandh Boutique Atelier
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs font-semibold rounded-sm transition-colors flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-[#D4A373] text-white shadow-sm'
                : 'bg-white text-[#2A2923] border border-[#DDCBA4] hover:bg-[#FAEDCD]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Order History</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-xs font-semibold rounded-sm transition-colors flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-[#D4A373] text-white shadow-sm'
                : 'bg-white text-[#2A2923] border border-[#DDCBA4] hover:bg-[#FAEDCD]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Address Details</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 text-xs font-semibold rounded-sm transition-colors flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'bg-[#D4A373] text-white shadow-sm'
                : 'bg-white text-[#2A2923] border border-[#DDCBA4] hover:bg-[#FAEDCD]'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Security</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Orders History */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Order Status Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setOrderStatusFilter(tab.value)}
                className={`px-3 py-1.5 text-xs rounded-sm whitespace-nowrap transition-colors ${
                  orderStatusFilter === tab.value
                    ? 'bg-[#2A2923] text-white font-semibold'
                    : 'bg-[#FAEDCD]/50 text-[#686558] hover:bg-[#FAEDCD] border border-[#DDCBA4]/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Orders List */}
          {orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-[#FDFBF7] p-6 border border-[#DDCBA4] rounded-sm shadow-warm-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DDCBA4]/40">
                    <div>
                      <span className="text-[11px] text-[#686558] font-mono">
                        Order #{order.orderNumber}
                      </span>
                      <p className="text-xs text-[#686558] mt-0.5">
                        Placed on{' '}
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant={order.orderStatus}>{order.orderStatus.replace('_', ' ')}</Badge>
                      <span className="font-serif text-base font-bold text-[#D4A373]">
                        ₹{order.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Order Items Snapshot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-16 object-cover rounded-sm border border-[#DDCBA4]/50"
                        />
                        <div className="text-xs min-w-0">
                          <p className="font-serif font-semibold text-[#2A2923] truncate">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-[#686558]">
                            Qty: {item.quantity} • Size: {item.selectedSize}
                          </p>
                          <p className="text-xs font-semibold text-[#D4A373]">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions & Tracking Row */}
                  <div className="pt-3 border-t border-[#DDCBA4]/40 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-[#686558]">
                      Destination: {order.shippingAddress?.city}, {order.shippingAddress?.state}
                    </p>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Eye}
                        onClick={() => setSelectedOrder(order)}
                      >
                        Inspect Details
                      </Button>

                      {['pending', 'confirmed'].includes(order.orderStatus) && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsCancelModalOpen(true);
                          }}
                        >
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Package}
              title="No Orders Found"
              description={`You have no ${orderStatusFilter === 'all' ? '' : orderStatusFilter} orders placed yet.`}
            />
          )}
        </div>
      )}

      {/* Tab 2: Personal & Address Information */}
      {activeTab === 'profile' && (
        <div className="bg-[#FDFBF7] p-6 md:p-8 border border-[#DDCBA4] rounded-sm shadow-warm-sm max-w-2xl space-y-6">
          <div className="border-b border-[#DDCBA4]/40 pb-3">
            <h2 className="font-serif text-xl font-bold text-[#2A2923]">Personal Profile & Delivery Address</h2>
            <p className="text-xs text-[#686558] mt-0.5">
              Update your contact details and default shipping destination for swift atelier checkout.
            </p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#2A2923] block mb-1">Full Name *</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                  placeholder="Simran Kaur"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2A2923] block mb-1">
                  Email Address <span className="text-[10px] text-[#686558] font-normal">(Account bound)</span>
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3 py-2 text-xs bg-stone-100/70 border border-[#DDCBA4] text-[#686558] rounded-sm cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#2A2923] block mb-1">
                Phone Contact *
              </label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#2A2923] block mb-1">
                Default Delivery Address / Street *
              </label>
              <input
                type="text"
                value={profileForm.address}
                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                placeholder="House 42, Mall Road, Heritage Enclave"
                className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#2A2923] block mb-1">City *</label>
                <input
                  type="text"
                  value={profileForm.city}
                  onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                  placeholder="Amritsar"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2A2923] block mb-1">State *</label>
                <input
                  type="text"
                  value={profileForm.state}
                  onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                  placeholder="Punjab"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2A2923] block mb-1">Pincode *</label>
                <input
                  type="text"
                  value={profileForm.pincode}
                  onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                  placeholder="143001"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#2A2923] block mb-1">Country</label>
              <input
                type="text"
                value={profileForm.country || 'India'}
                onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                placeholder="India"
                className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isUpdatingProfile}
                disabled={isUpdatingProfile}
              >
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Security */}
      {activeTab === 'security' && (
        <div className="bg-[#FDFBF7] p-8 border border-[#DDCBA4] rounded-sm shadow-warm-sm max-w-xl space-y-6">
          <h2 className="font-serif text-xl font-bold text-[#2A2923]">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#2A2923] block mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  required
                  className="w-full px-3 pr-10 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-2.5 text-[#686558] hover:text-[#2A2923] transition-colors focus:outline-none"
                  aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#2A2923] block mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                  minLength={6}
                  className="w-full px-3 pr-10 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2.5 text-[#686558] hover:text-[#2A2923] transition-colors focus:outline-none"
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#2A2923] block mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  required
                  className="w-full px-3 pr-10 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-[#686558] hover:text-[#2A2923] transition-colors focus:outline-none"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isChangingPassword}
              disabled={isChangingPassword}
            >
              Update Password
            </Button>
          </form>
        </div>
      )}

      {/* Inspect Order Details Modal */}
      {selectedOrder && !isCancelModalOpen && (
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Order #${selectedOrder.orderNumber}`}
          subtitle={`Placed on ${new Date(selectedOrder.createdAt).toLocaleDateString('en-IN')}`}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between p-3 bg-[#FAEDCD]/40 rounded-sm border border-[#DDCBA4]/60">
              <span className="text-xs font-semibold text-[#2A2923]">Order Status:</span>
              <Badge variant={selectedOrder.orderStatus}>
                {selectedOrder.orderStatus.replace('_', ' ')}
              </Badge>
            </div>

            <div className="space-y-3">
              <h4 className="font-serif text-sm font-semibold text-[#2A2923]">Items Purchased</h4>
              <div className="divide-y divide-[#DDCBA4]/30">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-14 object-cover rounded-sm border border-[#DDCBA4]/50"
                      />
                      <div>
                        <p className="font-semibold text-[#2A2923]">{item.name}</p>
                        <p className="text-[11px] text-[#686558]">
                          Size: {item.selectedSize} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-[#D4A373]">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-[#E9EDC9]/40 rounded-sm border border-[#CCD5AE]/40 text-xs space-y-1">
              <p className="font-semibold text-[#2A2923]">Delivery Destination:</p>
              <p className="text-[#686558]">{selectedOrder.shippingAddress?.fullName}</p>
              <p className="text-[#686558]">
                {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city},{' '}
                {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
              </p>
              <p className="text-[#686558]">Phone: {selectedOrder.shippingAddress?.phone}</p>
            </div>

            <div className="pt-2 border-t border-[#DDCBA4]/40 flex justify-between items-baseline">
              <span className="text-xs font-semibold text-[#2A2923]">Total Paid</span>
              <span className="font-serif text-lg font-bold text-[#D4A373]">
                ₹{selectedOrder.total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </Modal>
      )}

      {/* Cancel Order Modal */}
      {isCancelModalOpen && selectedOrder && (
        <Modal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          title="Cancel Order Confirmation"
          subtitle={`Order #${selectedOrder.orderNumber}`}
        >
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 text-xs text-amber-800 rounded-sm flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Cancelling this order will release the reserved inventory back to our winter
                collection.
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#2A2923] block mb-1">
                Reason for Cancellation
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                placeholder="E.g., Ordered incorrect size, changed design preference..."
                className="w-full p-2.5 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="warm"
                size="sm"
                onClick={() => setIsCancelModalOpen(false)}
                disabled={isCancelling}
              >
                Keep Order
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmCancel}
                isLoading={isCancelling}
                disabled={isCancelling}
              >
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProfilePage;
