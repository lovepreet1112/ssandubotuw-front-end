import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import { Star, CheckCircle, EyeOff, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllReviews();
      if (res.data?.reviews) setReviews(res.data.reviews);
    } catch (err) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleToggleApproval = async (reviewId) => {
    try {
      await adminService.toggleReviewApproval(reviewId);
      loadReviews();
    } catch (err) {
      toast.error('Failed to update review status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#2A2923]">Reviews Moderation</h1>
        <p className="text-xs text-[#686558] mt-0.5">
          Moderate collector testimonials and control public visibility on product pages.
        </p>
      </div>

      <div className="bg-white border border-[#DDCBA4]/60 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAEDCD]/40 text-[#2A2923] uppercase font-semibold border-b border-[#DDCBA4]/50">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Reviewer</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Feedback</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDCBA4]/30 text-[#2A2923]">
              {reviews.map((rev) => (
                <tr key={rev._id} className="hover:bg-[#FAEDCD]/20">
                  <td className="p-3 font-serif font-semibold text-[#2A2923]">
                    {rev.product?.name || 'Artisan Sweater'}
                  </td>
                  <td className="p-3">
                    <p className="font-semibold">{rev.userName || rev.user?.name}</p>
                    {rev.isVerifiedPurchase && (
                      <span className="text-[10px] text-emerald-700">Verified Buyer</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                  </td>
                  <td className="p-3 max-w-xs truncate text-[#686558]">{rev.comment}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        rev.isApproved
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {rev.isApproved ? 'Live on Store' : 'Hidden'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleToggleApproval(rev._id)}
                      className={`text-xs font-semibold hover:underline ${
                        rev.isApproved ? 'text-amber-800' : 'text-emerald-700'
                      }`}
                    >
                      {rev.isApproved ? 'Hide Review' : 'Approve Review'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReviewsPage;
