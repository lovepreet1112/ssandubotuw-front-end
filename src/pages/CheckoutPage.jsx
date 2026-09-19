import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShieldCheck, CreditCard, Truck, CheckCircle2, Lock, Edit3, Phone, MapPin, Check } from 'lucide-react';
import { fetchCart, clearCart } from '../redux/slices/cartSlice';
import { createOrder } from '../redux/slices/orderSlice';
import { updateUserProfile } from '../redux/slices/userSlice';
import paymentService from '../services/paymentService';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { cart, summary } = useSelector((state) => state.cart);

  // Retrieve saved address from localStorage or user profile
  const getInitialAddress = () => {
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem('sandh_saved_address'));
    } catch {
      saved = null;
    }
    return {
      fullName: user?.name || saved?.fullName || '',
      phone: user?.phone || saved?.phone || '',
      email: user?.email || saved?.email || '',
      address: user?.address || saved?.address || '',
      city: user?.city || saved?.city || 'Amritsar',
      state: user?.state || saved?.state || 'Punjab',
      pincode: user?.pincode || saved?.pincode || '',
      country: user?.country || saved?.country || 'India',
    };
  };

  const [addressData, setAddressData] = useState(getInitialAddress);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [saveToProfile, setSaveToProfile] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if a complete saved address exists
  const hasExistingAddress = Boolean(
    addressData.fullName &&
    addressData.phone &&
    addressData.address &&
    addressData.city &&
    addressData.pincode
  );

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Pre-fill fields if user profile updates
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

  const validItems = (cart?.items || []).filter((item) => item && item.product && item.product._id);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!addressData.fullName || !addressData.address || !addressData.city || !addressData.pincode) {
      toast.error('Please fill in complete delivery address details');
      return;
    }

    if (validItems.length === 0 || summary.total <= 0) {
      toast.error('Your cart is empty');
      navigate('/clothing');
      return;
    }

    try {
      setIsProcessing(true);

      let gatewayOrderId = `cod_${Date.now()}`;
      let paymentId = `pay_cod_${Date.now()}`;

      if (paymentMethod === 'razorpay') {
        // 1. Request Payment Session from Backend
        const paySessionRes = await paymentService.createPaymentOrder(summary.total);
        gatewayOrderId = paySessionRes.data?.gatewayOrderId || `mock_${Date.now()}`;

        // 2. Simulate or execute payment verification
        paymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        await paymentService.verifyPayment({
          razorpay_order_id: gatewayOrderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: 'sandbox-verified-signature',
          amount: summary.total,
        });
      }

      // 3. Create confirmed Order with verified payment info
      const orderPayload = {
        shippingAddress: addressData,
        paymentInfo: {
          method: paymentMethod,
          status: paymentMethod === 'razorpay' ? 'paid' : 'pending',
          gatewayOrderId,
          paymentId,
          transactionId: `TXN-${Date.now()}`,
        },
      };

      const result = await dispatch(createOrder(orderPayload));

      if (result.type === 'orders/createOrder/fulfilled') {
        try {
          localStorage.setItem('sandh_saved_address', JSON.stringify(addressData));
        } catch {
          // ignore
        }

        if (saveToProfile) {
          dispatch(
            updateUserProfile({
              phone: addressData.phone,
              address: addressData.address,
              city: addressData.city,
              state: addressData.state,
              pincode: addressData.pincode,
              country: addressData.country,
            })
          );
        }

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

  if (validItems.length === 0) {
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
            <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-[#DDCBA4]/40">
              <div className="flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-[#D4A373]" />
                <h2 className="font-serif text-lg font-bold text-[#2A2923]">1. Delivery Destination</h2>
                {hasExistingAddress && !isEditingAddress ? (
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> Saved Address
                  </span>
                ) : (
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#D4A373] bg-[#FAEDCD]/60 border border-[#DDCBA4] px-2 py-0.5 rounded-full">
                    {hasExistingAddress ? 'Editing Address' : 'New Destination'}
                  </span>
                )}
              </div>

              {/* Top Edit / Switch Button */}
              {hasExistingAddress && !isEditingAddress ? (
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#D4A373] hover:text-white bg-white hover:bg-[#D4A373] border border-[#DDCBA4] hover:border-[#D4A373] rounded-sm transition-all shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Address</span>
                </button>
              ) : hasExistingAddress ? (
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(false)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#686558] hover:text-[#2A2923] bg-white border border-[#DDCBA4] hover:bg-[#FAEDCD]/40 rounded-sm transition-all shadow-xs"
                >
                  <span>Use Saved Address</span>
                </button>
              ) : null}
            </div>

            {/* If user already has an address and is NOT editing: Show the clean saved card */}
            {hasExistingAddress && !isEditingAddress ? (
              <div className="p-4 bg-white border border-[#DDCBA4]/70 rounded-sm space-y-3 relative shadow-xs">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm text-[#2A2923] flex items-center gap-2">
                    <span>{addressData.fullName}</span>
                    <span className="text-[10px] bg-[#FAEDCD] text-[#2A2923] px-2 py-0.5 rounded font-normal">Default</span>
                  </p>
                  <span className="text-xs text-[#686558] flex items-center gap-1 font-mono">
                    <Phone className="w-3.5 h-3.5 text-[#D4A373]" />
                    {addressData.phone}
                  </span>
                </div>

                <div className="text-xs text-[#2A2923] flex items-start gap-2 pt-1 border-t border-[#DDCBA4]/30">
                  <MapPin className="w-4 h-4 text-[#D4A373] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{addressData.address}</p>
                    <p className="text-[#686558] mt-0.5">
                      {addressData.city}, {addressData.state} - {addressData.pincode}, {addressData.country || 'India'}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#DDCBA4]/30 flex items-center justify-between text-[11px] text-[#686558]">
                  <span>Your winter parcel will be dispatched to this location.</span>
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(true)}
                    className="text-[#D4A373] hover:text-[#2A2923] font-semibold underline underline-offset-2 transition-colors"
                  >
                    Place order at another address?
                  </button>
                </div>
              </div>
            ) : (
              /* Editable Address Form */
              <div className="space-y-4">
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

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-[#686558]">
                    <input
                      type="checkbox"
                      checked={saveToProfile}
                      onChange={(e) => setSaveToProfile(e.target.checked)}
                      className="rounded border-[#DDCBA4] text-[#D4A373] focus:ring-0"
                    />
                    <span>Save this address for future orders</span>
                  </label>

                  {hasExistingAddress && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingAddress(false)}
                        className="px-3 py-1.5 text-xs text-[#686558] hover:text-[#2A2923] transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!addressData.fullName || !addressData.address || !addressData.city || !addressData.pincode) {
                            toast.error('Please fill in required address fields');
                            return;
                          }
                          try {
                            localStorage.setItem('sandh_saved_address', JSON.stringify(addressData));
                          } catch {
                            // ignore
                          }
                          setIsEditingAddress(false);
                          toast.success('Address updated for this order');
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-[#2A2923] text-white hover:bg-[#D4A373] rounded-sm transition-colors shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm Address</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
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
            {validItems.map((item) => {
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
            disabled={isProcessing || validItems.length === 0 || summary.total <= 0}
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
