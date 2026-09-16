import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import ProductCard from '../products/ProductCard';

export const UpcomingProducts = ({ products = [], loading = false }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-[#FAEDCD]/30 border-b border-[#DDCBA4]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#D4A373] font-semibold mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Winter Studio Releases</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2A2923]">
              New & Upcoming Creations
            </h2>
            <p className="text-sm text-[#686558] mt-1.5 max-w-xl">
              Fresh off the wooden needles. Explore our newest winter designs and upcoming gala
              pieces.
            </p>
          </div>

          <Link
            to="/clothing?sort=newest"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#D4A373] hover:text-[#2A2923] transition-colors"
          >
            <span>Explore All New Releases</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingProducts;
