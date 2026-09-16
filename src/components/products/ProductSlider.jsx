import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ProductCard from './ProductCard';

// Swiper CSS
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const ProductSlider = ({
  products = [],
  slidesPerView = {
    320: { slidesPerView: 1.2, spaceBetween: 12 },
    640: { slidesPerView: 2.2, spaceBetween: 16 },
    1024: { slidesPerView: 3.5, spaceBetween: 24 },
    1280: { slidesPerView: 4, spaceBetween: 24 },
  },
  autoplay = false,
}) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="relative product-slider-container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={slidesPerView}
        navigation
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={
          autoplay
            ? { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }
            : false
        }
        className="pb-12"
      >
        {products.map((product) => (
          <SwiperSlide key={product._id} className="h-auto">
            <div className="h-full">
              <ProductCard product={product} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
