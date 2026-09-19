import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, Star, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { addToCart } from '../../redux/slices/cartSlice';
import Badge from '../common/Badge';

export const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!product) return null;

  const {
    _id,
    name,
    slug,
    category,
    price,
    discountPrice,
    discountPercentage,
    thumbnail,
    images = [],
    sizes = [],
    stock = 0,
    lowStockThreshold = 5,
    ratings = 0,
    reviewCount = 0,
    isUpcoming = false,
  } = product;

  const displayImage = thumbnail || images[0] || 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80';
  const effectivePrice = discountPrice > 0 ? discountPrice : price;
  const isOutOfStock = stock <= 0 || !product.isAvailable;
  const isLowStock = !isOutOfStock && stock <= lowStockThreshold;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || isUpcoming) return;

    if (!isAuthenticated) {
      toast.error('Please sign in to add items to your cart');
      const redirectPath = encodeURIComponent(location.pathname + location.search);
      navigate(`/login?redirect=${redirectPath}`);
      return;
    }

    dispatch(
      addToCart({
        productId: _id,
        quantity: 1,
        selectedSize: sizes[0] || 'M',
        selectedColor: product.colors?.[0] || 'Natural Cream',
      })
    );
  };

  return (
    <div className="group relative bg-[#FDFBF7] border border-[#DDCBA4]/60 hover:border-[#D4A373] transition-all duration-300 rounded-sm flex flex-col overflow-hidden hover:shadow-warm-md">
      {/* Product Image Container */}
      <Link to={`/product/${slug || _id}`} className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAEDCD]/40">
        <img
          src={displayImage}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discountPercentage > 0 && (
            <Badge variant="discount" size="xs">
              {discountPercentage}% OFF
            </Badge>
          )}
          {isUpcoming && (
            <Badge variant="accent" size="xs">
              Preview Only
            </Badge>
          )}
          {isLowStock && (
            <Badge variant="lowStock" size="xs">
              Only {stock} Left
            </Badge>
          )}
          {isOutOfStock && !isUpcoming && (
            <Badge variant="outOfStock" size="xs">
              Sold Out
            </Badge>
          )}
        </div>

        {/* Quick Action Overlay on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {!isOutOfStock && !isUpcoming ? (
            <button
              onClick={handleQuickAdd}
              className="px-3.5 py-1.5 bg-[#D4A373] hover:bg-[#c28f5e] text-white text-xs font-semibold rounded-sm flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Quick Add</span>
            </button>
          ) : (
            <span className="text-xs text-white bg-black/60 px-3 py-1 rounded">
              {isUpcoming ? 'Coming Soon' : 'Out of Stock'}
            </span>
          )}
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#686558] mb-1">
            <span className="uppercase tracking-wider font-medium">{category}</span>
            {ratings > 0 && (
              <span className="flex items-center gap-1 text-amber-700 font-medium">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>{ratings.toFixed(1)}</span>
                {reviewCount > 0 && <span className="text-[#686558]">({reviewCount})</span>}
              </span>
            )}
          </div>

          <Link to={`/product/${slug || _id}`}>
            <h3 className="font-serif text-sm font-semibold text-[#2A2923] hover:text-[#D4A373] transition-colors line-clamp-1">
              {name}
            </h3>
          </Link>

          {/* Sizes preview */}
          {sizes.length > 0 && (
            <p className="text-[11px] text-[#686558] mt-1">
              Sizes: <span className="text-[#2A2923]">{sizes.join(' • ')}</span>
            </p>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 mt-3 border-t border-[#DDCBA4]/40 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm md:text-base font-serif font-bold text-[#2A2923]">
              ₹{effectivePrice.toLocaleString('en-IN')}
            </span>
            {discountPrice > 0 && (
              <span className="text-xs text-[#686558] line-through">
                ₹{price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <Link
            to={`/product/${slug || _id}`}
            className="text-xs text-[#D4A373] hover:text-[#2A2923] font-medium flex items-center gap-1"
          >
            <span>Details</span>
            <Eye className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
