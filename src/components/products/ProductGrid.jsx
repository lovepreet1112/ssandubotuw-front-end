import React from 'react';
import ProductCard from './ProductCard';
import EmptyState from '../common/EmptyState';
import { PackageSearch } from 'lucide-react';

export const ProductGrid = ({
  products = [],
  loading = false,
  onResetFilters,
  emptyMessage = 'No winter creations matched your filter criteria.',
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, idx) => (
          <div
            key={idx}
            className="bg-[#FDFBF7] border border-[#DDCBA4]/50 rounded-sm overflow-hidden animate-pulse"
          >
            <div className="aspect-[3/4] bg-[#FAEDCD]/50 w-full" />
            <div className="p-4 space-y-2">
              <div className="h-3 bg-[#E9EDC9]/70 rounded w-1/3" />
              <div className="h-4 bg-[#FAEDCD] rounded w-3/4" />
              <div className="h-3 bg-[#FAEDCD]/50 rounded w-1/2 pt-1" />
              <div className="h-4 bg-[#D4A373]/30 rounded w-1/4 pt-2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="No Products Found"
        description={emptyMessage}
        actionLabel={onResetFilters ? 'Clear All Filters' : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
