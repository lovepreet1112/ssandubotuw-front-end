import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Plus,
  Minus,
  CheckCircle,
  MessageSquare,
} from 'lucide-react';
import { fetchProductDetails } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import reviewService from '../services/reviewService';
import productService from '../services/productService';
import ProductSlider from '../components/products/ProductSlider';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { InlineLoader } from '../components/common/Loader';
import toast from 'react-hot-toast';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentProduct, detailsLoading } = useSelector((state) => state.products);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [activeImage, setActiveImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Reviews and related
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, dispatch]);

  useEffect(() => {
    if (currentProduct) {
      setActiveImage(currentProduct.thumbnail || currentProduct.images?.[0] || '');
      setSelectedSize(currentProduct.sizes?.[0] || 'M');
      setSelectedColor(currentProduct.colors?.[0] || 'Natural Cream');
      setQuantity(1);

      // Fetch reviews
      reviewService
        .getProductReviews(currentProduct._id)
        .then((res) => {
          if (res.data?.reviews) setReviews(res.data.reviews);
        })
        .catch(() => {});

      // Fetch related products in same category
      productService
        .getProducts({ category: currentProduct.category, limit: 6 })
        .then((res) => {
          if (res.data?.products) {
            setRelatedProducts(
              res.data.products.filter((p) => p._id !== currentProduct._id)
            );
          }
        })
        .catch(() => {});
    }
  }, [currentProduct]);

  if (detailsLoading || !currentProduct) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FDFBF7]">
        <InlineLoader size="lg" />
      </div>
    );
  }

  const {
    _id,
    name,
    category,
    price,
    discountPrice,
    discountPercentage,
    description,
    material,
    design,
    sizes = [],
    colors = [],
    stock = 0,
    lowStockThreshold = 5,
    ratings = 0,
    reviewCount = 0,
    images = [],
    isUpcoming = false,
  } = currentProduct;

  const effectivePrice = discountPrice > 0 ? discountPrice : price;
  const isOutOfStock = stock <= 0 || !currentProduct.isAvailable;
  const isLowStock = !isOutOfStock && stock <= lowStockThreshold;

  const handleAddToCart = () => {
    if (isOutOfStock || isUpcoming) return;
    dispatch(
      addToCart({
        productId: _id,
        quantity,
        selectedSize,
        selectedColor,
        selectedDesign: design,
      })
    );
  };

  const handleBuyNow = () => {
    if (isOutOfStock || isUpcoming) return;
    dispatch(
      addToCart({
        productId: _id,
        quantity,
        selectedSize,
        selectedColor,
        selectedDesign: design,
      })
    );
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to leave a review');
      navigate('/login');
      return;
    }
    if (!newComment.trim()) return;

    try {
      setIsSubmittingReview(true);
      const res = await reviewService.createReview({
        productId: _id,
        rating: newRating,
        comment: newComment.trim(),
      });
      if (res?.data?.review) {
        setReviews([res.data.review, ...reviews]);
        setNewComment('');
        dispatch(fetchProductDetails(_id)); // Refresh ratings
      }
    } catch (err) {
      // Handled by apiRequest toast
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="py-10 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Product Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-[3/4] w-full rounded-sm overflow-hidden border border-[#DDCBA4] shadow-warm-md bg-[#FAEDCD]/50 relative">
            <img
              src={activeImage}
              alt={name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {discountPercentage > 0 && (
              <div className="absolute top-4 left-4">
                <Badge variant="discount" size="sm">
                  {discountPercentage}% OFF
                </Badge>
              </div>
            )}
          </div>

          {/* Thumbnail row */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-24 rounded-sm overflow-hidden border-2 transition-all ${
                    activeImage === img
                      ? 'border-[#D4A373] shadow-sm scale-105'
                      : 'border-[#DDCBA4]/60 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${name} preview ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#D4A373] font-semibold mb-1">
              <span>{category}</span>
              <span>•</span>
              <span>Handcrafted In Punjab</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2A2923] leading-tight">
              {name}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center gap-3 mt-2 text-xs text-[#686558]">
              <div className="flex items-center gap-1 text-amber-600 font-semibold">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{ratings > 0 ? ratings.toFixed(1) : 'New'}</span>
              </div>
              <span>•</span>
              <span>{reviewCount} verified collector reviews</span>
            </div>
          </div>

          {/* Price Block */}
          <div className="p-4 bg-[#FAEDCD]/40 rounded-sm border border-[#DDCBA4]/60 flex items-baseline gap-3">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#2A2923]">
              ₹{effectivePrice.toLocaleString('en-IN')}
            </span>
            {discountPrice > 0 && (
              <span className="text-base text-[#686558] line-through">
                ₹{price.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-xs text-[#686558] ml-auto">Taxes & Atelier Craft Included</span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#686558] leading-relaxed">{description}</p>

          {/* Specifications Box */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-[#E9EDC9]/30 rounded-sm border border-[#CCD5AE]/40 text-xs">
            <div>
              <span className="text-[#686558]">Material Specification:</span>
              <p className="font-semibold text-[#2A2923] mt-0.5">{material}</p>
            </div>
            <div>
              <span className="text-[#686558]">Weave & Needlework:</span>
              <p className="font-semibold text-[#2A2923] mt-0.5">{design}</p>
            </div>
          </div>

          {/* Color Selector */}
          {colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#2A2923] block">
                Selected Hue: <strong className="text-[#D4A373]">{selectedColor}</strong>
              </label>
              <div className="flex flex-wrap gap-2">
                {colors.map((clr) => (
                  <button
                    key={clr}
                    onClick={() => setSelectedColor(clr)}
                    className={`px-3 py-1.5 rounded-sm text-xs border transition-colors ${
                      selectedColor === clr
                        ? 'bg-[#CCD5AE] font-semibold text-[#2A2923] border-[#2A2923]'
                        : 'bg-white text-[#686558] border-[#DDCBA4] hover:bg-[#FAEDCD]'
                    }`}
                  >
                    {clr}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {sizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold uppercase tracking-wider text-[#2A2923]">
                  Select Sizing
                </span>
                <span className="text-[#686558] underline cursor-pointer">Bespoke Fitting Guide</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-12 h-10 rounded-sm text-xs font-semibold border flex items-center justify-center transition-colors ${
                      selectedSize === sz
                        ? 'bg-[#D4A373] text-white border-[#D4A373] shadow-sm'
                        : 'bg-white text-[#2A2923] border-[#DDCBA4] hover:bg-[#FAEDCD]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Status Notice */}
          <div className="text-xs">
            {isOutOfStock ? (
              <Badge variant="outOfStock">Currently Out of Stock</Badge>
            ) : isLowStock ? (
              <Badge variant="lowStock">Only {stock} items left in this batch</Badge>
            ) : (
              <Badge variant="inStock">In Stock • Ready for Atelier Dispatch</Badge>
            )}
          </div>

          {/* Quantity and Actions */}
          {!isOutOfStock && !isUpcoming && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#DDCBA4] rounded-sm bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2.5 text-[#2A2923] hover:bg-[#FAEDCD] disabled:opacity-40"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-bold text-[#2A2923]">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                    disabled={quantity >= stock}
                    className="p-2.5 text-[#2A2923] hover:bg-[#FAEDCD] disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  className="flex-1"
                  onClick={handleAddToCart}
                  icon={ShoppingBag}
                >
                  Add to Bag
                </Button>

                <Button variant="dark" size="md" onClick={handleBuyNow}>
                  Buy Now
                </Button>
              </div>
            </div>
          )}

          {/* Trust Value Badges */}
          <div className="pt-6 border-t border-[#DDCBA4]/50 grid grid-cols-3 gap-2 text-center text-[11px] text-[#686558]">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-[#D4A373]" />
              <span>Free Shipping &gt; ₹2,000</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#D4A373]" />
              <span>100% Authentic Wool</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-[#D4A373]" />
              <span>7-Day Sizing Exchange</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="pt-10 border-t border-[#DDCBA4]/60 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#2A2923]">Collector Reviews</h3>
            <p className="text-xs text-[#686558] mt-1">
              Verified feedback from collectors wearing this handcrafted piece.
            </p>
          </div>
        </div>

        {/* Review Form */}
        <div className="p-6 bg-[#FAEDCD]/30 border border-[#DDCBA4] rounded-sm">
          <h4 className="font-serif text-sm font-semibold text-[#2A2923] mb-3">
            Leave Your Thoughts on this Piece
          </h4>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#686558]">Your Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setNewRating(star)}
                    className="p-0.5 text-amber-500 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-4 h-4 ${star <= newRating ? 'fill-amber-500' : 'text-stone-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                required
                placeholder="Share your experience with the softness, fit, warmth and craftsmanship..."
                className="w-full p-3 text-xs bg-white border border-[#DDCBA4] rounded-sm focus:outline-none focus:border-[#D4A373]"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmittingReview}
              disabled={isSubmittingReview}
            >
              Submit Review
            </Button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="divide-y divide-[#DDCBA4]/40">
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div key={rev._id} className="py-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-semibold text-[#2A2923]">
                      {rev.userName || rev.user?.name}
                    </span>
                    {rev.isVerifiedPurchase && (
                      <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#686558]">
                    {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-amber-500" />
                  ))}
                </div>

                <p className="text-xs text-[#686558] leading-relaxed pt-1">{rev.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#686558] py-4 italic">
              No reviews yet for this winter creation. Be the first to share your thoughts!
            </p>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-[#DDCBA4]/60 space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-[0.2em] text-[#D4A373] font-semibold">
              Complementary Pieces
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#2A2923] mt-1">
              You May Also Admire
            </h3>
          </div>
          <ProductSlider products={relatedProducts} />
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
