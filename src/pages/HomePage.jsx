import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HeroSection from '../components/home/HeroSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import UpcomingProducts from '../components/home/UpcomingProducts';
import CategoryShowcase from '../components/home/CategoryShowcase';
import BrandStory from '../components/home/BrandStory';
import WhyChooseUs from '../components/home/WhyChooseUs';
import CustomerReviews from '../components/home/CustomerReviews';
import CTASection from '../components/home/CTASection';
import { fetchFeaturedProducts, fetchNewArrivals } from '../redux/slices/productSlice';
import reviewService from '../services/reviewService';

export const HomePage = () => {
  const dispatch = useDispatch();
  const { featuredProducts, newArrivals, loading } = useSelector((state) => state.products);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchNewArrivals());

    // Fetch initial customer reviews
    const loadReviews = async () => {
      try {
        // Fetch first approved reviews
        const res = await reviewService.getProductReviews('6aaab86783afaf41922aaa92');
        if (res?.data?.reviews) setReviews(res.data.reviews);
      } catch (err) {
        // Fallback reviews used automatically in CustomerReviews component
      }
    };
    loadReviews();
  }, [dispatch]);

  return (
    <div className="space-y-0">
      <HeroSection />
      <FeaturedProducts products={featuredProducts} loading={loading} />
      <CategoryShowcase />
      <UpcomingProducts products={newArrivals} loading={loading} />
      <BrandStory />
      <WhyChooseUs />
      <CTASection />
      <CustomerReviews reviews={reviews} />
    </div>
  );
};

export default HomePage;
