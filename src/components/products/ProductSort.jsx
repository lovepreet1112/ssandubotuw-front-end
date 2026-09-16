import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSort } from '../../redux/slices/filterSlice';
import { ArrowUpDown } from 'lucide-react';

export const ProductSort = ({ totalCount = 0 }) => {
  const dispatch = useDispatch();
  const currentSort = useSelector((state) => state.filters.sort);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-[#DDCBA4]/50">
      <p className="text-xs md:text-sm text-[#686558]">
        Showing <strong className="text-[#2A2923]">{totalCount}</strong> winter artisan creations
      </p>

      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-3.5 h-3.5 text-[#686558]" />
        <label htmlFor="sortSelect" className="text-xs font-medium text-[#686558]">
          Sort By:
        </label>
        <select
          id="sortSelect"
          value={currentSort}
          onChange={(e) => dispatch(setSort(e.target.value))}
          className="text-xs bg-white border border-[#DDCBA4] rounded-sm px-2.5 py-1.5 text-[#2A2923] focus:outline-none focus:border-[#D4A373] cursor-pointer"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="popular">Most Popular</option>
          <option value="discount">Highest Discount</option>
        </select>
      </div>
    </div>
  );
};

export default ProductSort;
