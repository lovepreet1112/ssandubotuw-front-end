import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import ProductSlider from '../products/ProductSlider';

export const FeaturedProducts = ({ products = [], loading = false }) => {
  return (
    <section className="py-16 md:py-24 bg-[#FDFBF7] border-b border-[#DDCBA4]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#D4A373] font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Winter Edit</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2A2923]">
              Featured Artisan Sweaters
            </h2>
            <p className="text-sm text-[#686558] mt-1.5 max-w-xl">
              Our most cherished winter knits, hand-spun and meticulously finished with heirloom
              needlework.
            </p>
          </div>

          <Link
            to="/clothing?featured=true"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#D4A373] hover:text-[#2A2923] transition-colors"
          >
            <span>View All Featured</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Swiper Slider */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-[#FAEDCD]/50 rounded-sm animate-pulse" />
            ))}
          </div>
        ) : (
          <ProductSlider products={products} autoplay={true} />
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
