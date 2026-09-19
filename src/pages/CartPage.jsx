import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, RotateCcw } from 'lucide-react';
import { fetchCart, updateCartItem, removeCartItem, clearCart } from '../redux/slices/cartSlice';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';

export const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart, summary, loading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  const handleQuantity = (itemId, currentQty, delta, maxStock) => {
    const next = currentQty + delta;
    if (next < 1 || next > maxStock) return;
    dispatch(updateCartItem({ itemId, quantity: next }));
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EmptyState
          icon={ShoppingBag}
          title={!isAuthenticated ? 'Sign In to View Your Bag' : 'Your Winter Bag is Empty'}
          description={
            !isAuthenticated
              ? 'Log in to view saved items in your cart, track orders, and complete checkout.'
              : 'Explore our hand-knitted pullovers, cardigans, and bespoke winter wraps to warm your season.'
          }
          actionLabel={!isAuthenticated ? 'Sign In to Account' : 'Explore Collection'}
          onAction={() => navigate(!isAuthenticated ? '/login?redirect=cart' : '/clothing')}
        />
      </div>
    );
  }

  return (
    <div className="py-10 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 pb-4 border-b border-[#DDCBA4]/60">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#D4A373] font-semibold">
            Your Bag • ਖਰੀਦਦਾਰੀ ਝੋਲਾ
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2A2923] mt-1">
            Shopping Bag ({summary.itemCount} Items)
          </h1>
        </div>

        <button
          onClick={() => dispatch(clearCart())}
          className="text-xs text-[#686558] hover:text-[#C86D51] flex items-center gap-1 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear All Bag Items</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 divide-y divide-[#DDCBA4]/40 bg-[#FDFBF7] p-6 border border-[#DDCBA4] rounded-sm shadow-warm-sm">
          {cart.items.map((item) => {
            const product = item.product;
            if (!product) return null;
            const price = item.priceSnapshot || product.discountPrice || product.price;

            return (
              <div key={item._id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-6">
                <Link to={`/product/${product.slug || product._id}`} className="shrink-0">
                  <img
                    src={product.thumbnail || product.images?.[0]}
                    alt={product.name}
                    className="w-24 h-32 object-cover rounded-sm border border-[#DDCBA4]/50 bg-[#FAEDCD]"
                  />
                </Link>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <Link to={`/product/${product.slug || product._id}`}>
                        <h3 className="font-serif text-base font-semibold text-[#2A2923] hover:text-[#D4A373] transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <button
                        onClick={() => dispatch(removeCartItem(item._id))}
                        className="text-[#686558] hover:text-[#C86D51] p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-[#686558] mt-1">Category: {product.category}</p>

                    <div className="flex items-center gap-4 text-xs text-[#686558] mt-2">
                      <span>
                        Size: <strong className="text-[#2A2923]">{item.selectedSize}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Hue: <strong className="text-[#2A2923]">{item.selectedColor}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#DDCBA4]/30">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#DDCBA4] rounded-sm bg-white">
                      <button
                        onClick={() => handleQuantity(item._id, item.quantity, -1, product.stock)}
                        disabled={item.quantity <= 1}
                        className="p-1.5 text-[#2A2923] hover:bg-[#FAEDCD] disabled:opacity-40"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-[#2A2923]">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantity(item._id, item.quantity, 1, product.stock)}
                        disabled={item.quantity >= product.stock}
                        className="p-1.5 text-[#2A2923] hover:bg-[#FAEDCD] disabled:opacity-40"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-serif text-base font-bold text-[#D4A373]">
                        ₹{(price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      {item.quantity > 1 && (
                        <p className="text-[11px] text-[#686558]">
                          ₹{price.toLocaleString('en-IN')} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-4 bg-[#FAEDCD]/40 p-6 md:p-8 border border-[#DDCBA4] rounded-sm shadow-warm-sm space-y-6 sticky top-24">
          <h3 className="font-serif text-lg font-bold text-[#2A2923]">Order Summary</h3>

          <div className="space-y-3 text-xs text-[#686558] pb-4 border-b border-[#DDCBA4]/50">
            <div className="flex justify-between">
              <span>Original Subtotal</span>
              <span className="font-medium text-[#2A2923]">
                ₹{summary.subtotal.toLocaleString('en-IN')}
              </span>
            </div>

            {summary.discount > 0 && (
              <div className="flex justify-between text-emerald-800">
                <span>Seasonal Atelier Discount</span>
                <span>-₹{summary.discount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span>
                {summary.shipping === 0 ? (
                  <strong className="text-emerald-800 font-semibold">Complimentary</strong>
                ) : (
                  `₹${summary.shipping}`
                )}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-baseline text-base font-serif font-bold text-[#2A2923]">
            <span>Total Payable</span>
            <span className="text-xl text-[#D4A373]">₹{summary.total.toLocaleString('en-IN')}</span>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full font-medium"
            onClick={handleCheckout}
            icon={ArrowRight}
            iconPosition="right"
          >
            Proceed to Checkout
          </Button>

          <p className="text-[11px] text-center text-[#686558]">
            Complimentary hand-stitched packaging included with every winter order.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
