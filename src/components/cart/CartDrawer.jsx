import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { closeCartDrawer, updateCartItem, removeCartItem } from '../../redux/slices/cartSlice';
import Button from '../common/Button';

export const CartDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, summary, isDrawerOpen, loading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleQuantityChange = (itemId, currentQty, delta, maxStock) => {
    const nextQty = currentQty + delta;
    if (nextQty < 1) return;
    if (nextQty > maxStock) return;
    dispatch(updateCartItem({ itemId, quantity: nextQty }));
  };

  const handleCheckout = () => {
    dispatch(closeCartDrawer());
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => dispatch(closeCartDrawer())}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Slide-over Drawer */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-screen max-w-md bg-[#FDFBF7] border-l border-[#DDCBA4] shadow-warm-lg flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-[#DDCBA4]/60 bg-[#FAEDCD]/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-[#D4A373]" />
                  <h3 className="font-serif text-lg font-semibold text-[#2A2923]">
                    Your Winter Bag ({summary.itemCount})
                  </h3>
                </div>
                <button
                  onClick={() => dispatch(closeCartDrawer())}
                  className="p-1 rounded-full text-[#686558] hover:text-[#2A2923] hover:bg-[#FAEDCD] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Banner */}
              <div className="px-5 py-2 bg-[#E9EDC9]/60 border-b border-[#CCD5AE]/40 text-xs text-[#2A2923] text-center">
                {summary.subtotal >= 2000 ? (
                  <span className="font-medium text-emerald-800">
                    🎉 You have qualified for Complimentary Shipping!
                  </span>
                ) : (
                  <span>
                    Add ₹{(2000 - summary.subtotal).toLocaleString('en-IN')} more to unlock Complimentary Shipping
                  </span>
                )}
              </div>

              {/* Drawer Item List */}
              <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#DDCBA4]/30">
                {cart.items && cart.items.length > 0 ? (
                  cart.items.map((item) => {
                    const product = item.product;
                    if (!product) return null;
                    const price = item.priceSnapshot || product.discountPrice || product.price;

                    return (
                      <div key={item._id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                        <img
                          src={product.thumbnail || product.images?.[0]}
                          alt={product.name}
                          className="w-20 h-24 object-cover rounded-sm border border-[#DDCBA4]/50 bg-[#FAEDCD]"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="text-sm font-serif font-medium text-[#2A2923] line-clamp-1">
                                {product.name}
                              </h4>
                              <button
                                onClick={() => dispatch(removeCartItem(item._id))}
                                className="text-[#686558] hover:text-[#C86D51] p-0.5"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="text-[11px] text-[#686558] mt-1 space-x-2">
                              <span>Size: <strong className="text-[#2A2923]">{item.selectedSize}</strong></span>
                              <span>•</span>
                              <span>Color: <strong className="text-[#2A2923]">{item.selectedColor}</strong></span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-[#DDCBA4] rounded-sm bg-[#FAEDCD]/40">
                              <button
                                onClick={() => handleQuantityChange(item._id, item.quantity, -1, product.stock)}
                                disabled={item.quantity <= 1}
                                className="p-1 text-[#2A2923] hover:bg-[#FAEDCD] disabled:opacity-40"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2.5 text-xs font-semibold text-[#2A2923]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item._id, item.quantity, 1, product.stock)}
                                disabled={item.quantity >= product.stock}
                                className="p-1 text-[#2A2923] hover:bg-[#FAEDCD] disabled:opacity-40"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <p className="text-sm font-semibold text-[#D4A373]">
                              ₹{(price * item.quantity).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-[#FAEDCD] flex items-center justify-center text-[#D4A373] mb-4">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h4 className="font-serif text-base font-semibold text-[#2A2923]">
                      {!isAuthenticated ? 'Sign In to View Bag' : 'Your Bag is Empty'}
                    </h4>
                    <p className="text-xs text-[#686558] mt-1 max-w-[220px]">
                      {!isAuthenticated
                        ? 'Sign in to access your saved bag, checkout, and view orders.'
                        : 'Discover our handmade winter sweaters and custom knitwear pieces.'}
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-5"
                      onClick={() => {
                        dispatch(closeCartDrawer());
                        if (!isAuthenticated) {
                          navigate('/login?redirect=cart');
                        } else {
                          navigate('/clothing');
                        }
                      }}
                    >
                      {!isAuthenticated ? 'Sign In' : 'Explore Collection'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              {cart.items && cart.items.length > 0 && (
                <div className="p-5 border-t border-[#DDCBA4]/60 bg-[#FAEDCD]/30 space-y-3">
                  <div className="space-y-1.5 text-xs text-[#686558]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium text-[#2A2923]">
                        ₹{summary.subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    {summary.discount > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Seasonal Savings</span>
                        <span>-₹{summary.discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        {summary.shipping === 0 ? (
                          <strong className="text-emerald-700 font-medium">Free</strong>
                        ) : (
                          `₹${summary.shipping}`
                        )}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-[#DDCBA4]/40 flex justify-between text-sm font-bold text-[#2A2923]">
                      <span>Estimated Total</span>
                      <span className="text-[#D4A373]">
                        ₹{summary.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full font-medium"
                      onClick={handleCheckout}
                      icon={ArrowRight}
                      iconPosition="right"
                    >
                      Proceed to Checkout
                    </Button>
                    <button
                      onClick={() => {
                        dispatch(closeCartDrawer());
                        navigate('/cart');
                      }}
                      className="text-xs text-center text-[#686558] hover:text-[#D4A373] transition-colors py-1"
                    >
                      View Full Bag & Cart Details
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
