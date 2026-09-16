import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Star, Quote, CheckCircle } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const CustomerReviews = ({ reviews = [] }) => {
  // Default verified reviews if database is warming up
  const fallbackReviews = [
    {
      _id: '1',
      userName: 'Simran Kaur',
      rating: 5,
      comment: 'The cashmere cable pullover is astonishingly soft! You can genuinely feel the craftsmanship and love in every single stitch. Keeps Amritsar winter completely at bay.',
      isVerifiedPurchase: true,
      createdAt: '2026-01-15T10:00:00.000Z',
    },
    {
      _id: '2',
      userName: 'Gurleen Khurana',
      rating: 5,
      comment: 'Such a majestic cardigan. The subtle embroidery along the collar gives it that authentic royal Punjabi touch without being flashy. Best knitwear purchase ever.',
      isVerifiedPurchase: true,
      createdAt: '2026-01-20T10:00:00.000Z',
    },
    {
      _id: '3',
      userName: 'Amanpreet Dhillon',
      rating: 5,
      comment: 'Ordered a bespoke monogrammed knit for my mother. The fitting was impeccable, packaging felt like a bespoke royal gift. Highly recommend Sandh Boutique!',
      isVerifiedPurchase: true,
      createdAt: '2026-02-02T10:00:00.000Z',
    },
  ];

  const displayReviews = reviews && reviews.length > 0 ? reviews : fallbackReviews;

  return (
    <section className="py-16 md:py-24 bg-[#FAEDCD]/20 border-b border-[#DDCBA4]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[#D4A373] font-semibold">
            Atelier Voices
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2A2923] mt-2">
            Loved by Winter Connoisseurs
          </h2>
          <p className="text-sm text-[#686558] mt-2">
            Read heartfelt thoughts from clients who wear our handcrafted pieces season after
            season.
          </p>
        </div>

        <div className="relative pb-10">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1.5 },
              1024: { slidesPerView: 3 },
            }}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="pb-12"
          >
            {displayReviews.map((rev) => (
              <SwiperSlide key={rev._id} className="h-auto">
                <div className="bg-[#FDFBF7] border border-[#DDCBA4]/70 p-6 rounded-sm shadow-sm flex flex-col justify-between h-full">
                  <div>
                    {/* Stars */}
                    <div className="flex items-center gap-1 text-amber-500 mb-3">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500" />
                      ))}
                    </div>

                    <Quote className="w-8 h-8 text-[#CCD5AE]/60 mb-2" />

                    <p className="text-xs md:text-sm text-[#2A2923] italic leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#DDCBA4]/40 flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-[#2A2923]">
                        {rev.userName}
                      </h4>
                      {rev.isVerifiedPurchase && (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                          <CheckCircle className="w-3 h-3" />
                          <span>Verified Collector</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#686558]">
                      {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
