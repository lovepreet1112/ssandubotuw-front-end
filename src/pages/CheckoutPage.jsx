import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShieldCheck, CreditCard, Truck, CheckCircle2, Lock } from 'lucide-react';
import { fetchCart, clearCart } from '../redux/slices/cartSlice';
import { createOrder } from '../redux/slices/orderSlice';
import paymentService from '../services/paymentService';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { cart, summary } = useSelector((state) => state.cart);

  const [addressData, setAddressData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || 'Amritsar',
    state: user?.state || 'Punjab',
    pincode: user?.pincode || '',
    country: user?.country || 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Pre-fill fields if user updates profile
  useEffect(() => {
    if (user) {
      setAddressData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        phone: prev.phone || user.phone || '',
        email: prev.email || user.email || '',
        address: prev.address || user.address || '',
        city: prev.city || user.city || 'Amritsar',
        state: prev.state || user.state || 'Punjab',
        pincode: prev.pincode || user.pincode || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!addressData.fullName || !addressData.address || !addressData.city || !addressData.pincode) {
      toast.error('Please fill in complete delivery address details');
      return;
    }

    if (!cart.items || cart.items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/clothing');
      return;
    }

    try {
      setIsProcessing(true);

      // 1. Request Payment Session from Backend
      const paySessionRes = await paymentService.createPaymentOrder(summary.total);
      const gatewayOrderId = paySessionRes.data?.gatewayOrderId || `mock_${Date.now()}`;

      // 2. Simulate or execute payment verification
      const mockPaymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const verificationRes = await paymentService.verifyPayment({
        razorpay_order_id: gatewayOrderId,
        razorpay_payment_id: mockPaymentId,
        razorpay_signature: 'sandbox-verified-signature',
        amount: summary.total,
      });

      // 3. Create confirmed Order with verified payment info
      const orderPayload = {
        shippingAddress: addressData,
        paymentInfo: {
          method: paymentMethod,
          status: 'paid',
          gatewayOrderId,
          paymentId: mockPaymentId,
          transactionId: `TXN-${Date.now()}`,
        },
      };

      const result = await dispatch(createOrder(orderPayload));

      if (result.type === 'orders/createOrder/fulfilled') {
        dispatch(clearCart());
        toast.success('Congratulations! Your winter order has been placed.');
        navigate(`/profile`);
      }
    } catch (err) {
      toast.error(err.message || 'Payment processing encountered an error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#2A2923]">No Items in Cart</h2>
        <p className="text-xs text-[#686558] mt-2 mb-6">
          Add some handcrafted winter knitwear before checking out.
        </p>
        <Button variant="primary" onClick={() => navigate('/clothing')}>
          Return to Collection
        </Button>
      </div>
    );
  }

  return (
    <div className="py-10 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div>
        <span className="text-xs uppercase tracking-[0.2em] text-[#D4A373] font-semibold">
          Final Step • ਆਰਡਰ ਪੁਸ਼ਟੀ
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2A2923] mt-1">
          Secure Atelier Checkout
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Delivery Address & Payment Method */}
        <div className="lg:col-span-7 space-y-8">
          {/* Address Section */}
          <div className="bg-[#FDFBF7] p-6 md:p-8 border border-[#DDCBA4] rounded-sm shadow-warm-sm space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#2A2923] flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#D4A373]" />
              <span>1. Delivery Destination</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#2A2923] block mb-1">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={addressData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Simran Kaur"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2A2923] block mb-1">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={addressData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#2A2923] block mb-1">
                Street Address / House No. *
              </label>
              <input
                type="text"
                name="address"
                value={addressData.address}
                onChange={handleChange}
                required
                placeholder="House 42, Mall Road, Heritage Enclave"
                className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#2A2923] block mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={addressData.city}
                  onChange={handleChange}
                  required
                  placeholder="Amritsar"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2A2923] block mb-1">State *</label>
                <input
                  type="text"
                  name="state"
                  value={addressData.state}
                  onChange={handleChange}
                  required
                  placeholder="Punjab"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#2A2923] block mb-1">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={addressData.pincode}
                  onChange={handleChange}
                  required
                  placeholder="143001"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-[#FDFBF7] p-6 md:p-8 border border-[#DDCBA4] rounded-sm shadow-warm-sm space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#2A2923] flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#D4A373]" />
              <span>2. Payment Method</span>
            </h2>

            <div className="space-y-3">
              <label
                className={`flex items-center justify-between p-4 rounded-sm border cursor-pointer transition-colors ${
                  paymentMethod === 'razorpay'
                    ? 'bg-[#FAEDCD]/50 border-[#D4A373]'
                    : 'bg-white border-[#DDCBA4]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="text-[#D4A373] focus:ring-[#D4A373]"
                  />
                  <div>
                    <strong className="text-xs sm:text-sm text-[#2A2923] block">
                      Razorpay Secure Payment (UPI, Cards, NetBanking)
                    </strong>
                    <span className="text-[11px] text-[#686558]">
                      Official payment gateway with instant 256-bit encryption.
                    </span>
                  </div>
                </div>
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              </label>

              <label
                className={`flex items-center justify-between p-4 rounded-sm border cursor-pointer transition-colors ${
                  paymentMethod === 'cod'
                    ? 'bg-[#FAEDCD]/50 border-[#D4A373]'
                    : 'bg-white border-[#DDCBA4]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="text-[#D4A373] focus:ring-[#D4A373]"
                  />
                  <div>
                    <strong className="text-xs sm:text-sm text-[#2A2923] block">
                      Atelier Cash on Delivery (COD)
                    </strong>
                    <span className="text-[11px] text-[#686558]">
                      Pay in cash upon physical receipt and verification at your doorstep.
                    </span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Snapshot */}
        <div className="lg:col-span-5 bg-[#FAEDCD]/40 p-6 md:p-8 border border-[#DDCBA4] rounded-sm shadow-warm-sm space-y-6 sticky top-24">
          <h2 className="font-serif text-lg font-bold text-[#2A2923]">Order Items Snapshot</h2>

          {/* Item Review list */}
          <div className="divide-y divide-[#DDCBA4]/40 max-h-64 overflow-y-auto pr-1">
            {cart.items.map((item) => {
              const product = item.product;
              if (!product) return null;
              const price = item.priceSnapshot || product.discountPrice || product.price;

              return (
                <div key={item._id} className="py-3 first:pt-0 flex gap-3 items-center">
                  <img
                    src={product.thumbnail || product.images?.[0]}
                    alt={product.name}
                    className="w-12 h-16 object-cover rounded-sm border border-[#DDCBA4]/50"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-serif font-semibold text-[#2A2923] truncate">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-[#686558]">
                      Qty: {item.quantity} • Size: {item.selectedSize}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#2A2923]">
                    ₹{(price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Costs */}
          <div className="space-y-2 text-xs text-[#686558] pt-3 border-t border-[#DDCBA4]/50">
            <div className="flex justify-between">
              <span>Original Subtotal</span>
              <span className="font-medium text-[#2A2923]">
                ₹{summary.subtotal.toLocaleString('en-IN')}
              </span>
            </div>

            {summary.discount > 0 && (
              <div className="flex justify-between text-emerald-800">
                <span>Atelier Discount</span>
                <span>-₹{summary.discount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span>
                {summary.shipping === 0 ? (
                  <strong className="text-emerald-800 font-semibold">Complimentary</strong>
                ) : (
                  `₹${summary.shipping}`
                )}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-baseline text-base font-serif font-bold text-[#2A2923] pt-2 border-t border-[#DDCBA4]/50">
            <span>Total Payable</span>
            <span className="text-xl text-[#D4A373]">₹{summary.total.toLocaleString('en-IN')}</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full font-medium"
            isLoading={isProcessing}
            disabled={isProcessing}
            icon={Lock}
          >
            Confirm & Place Order
          </Button>

          <p className="text-[11px] text-center text-[#686558] flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>End-to-End Cryptographically Signed Order Placement</span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
