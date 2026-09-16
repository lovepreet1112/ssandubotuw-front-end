import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RotateCcw, Filter } from 'lucide-react';
import {
  setCategory,
  setPriceRange,
  setSize,
  setColor,
  setAvailability,
  resetFilters,
} from '../../redux/slices/filterSlice';
import Button from '../common/Button';

const CATEGORIES = [
  'All',
  'Winter Sweaters',
  'Handmade Sweaters',
  'Custom Designs',
  'Cardigans',
  'Shawls & Wraps',
];

const SIZES = ['All', 'XS', 'S', 'M', 'L', 'XL', 'Custom'];

const COLORS = [
  'All',
  'Camel Sand',
  'Natural Cream',
  'Sage Olive',
  'Warm Terracotta',
  'Soft Cocoa',
  'Charcoal Heather',
];

const PRICE_PRESETS = [
  { label: 'All Prices', min: '', max: '' },
  { label: 'Under ₹4,500', min: '', max: '4500' },
  { label: '₹4,500 – ₹7,000', min: '4500', max: '7000' },
  { label: 'Above ₹7,000', min: '7000', max: '' },
];

export const ProductFilter = ({ className = '', isMobile = false, onCloseMobile }) => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);

  const handlePricePreset = (min, max) => {
    dispatch(setPriceRange({ min, max }));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DDCBA4]/60">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#D4A373]" />
          <h3 className="font-serif text-sm font-semibold tracking-wider text-[#2A2923] uppercase">
            Filter Atelier
          </h3>
        </div>
        <button
          onClick={() => {
            dispatch(resetFilters());
            if (onCloseMobile) onCloseMobile();
          }}
          className="text-xs text-[#686558] hover:text-[#D4A373] flex items-center gap-1 transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2A2923]">Category</h4>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                dispatch(setCategory(cat));
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                filters.category === cat
                  ? 'bg-[#CCD5AE] font-semibold text-[#2A2923]'
                  : 'text-[#686558] hover:bg-[#FAEDCD]/60 hover:text-[#2A2923]'
              }`}
            >
              <span>{cat}</span>
              {filters.category === cat && <span className="w-1.5 h-1.5 rounded-full bg-[#2A2923]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2A2923]">Price Range</h4>
        <div className="space-y-1.5">
          {PRICE_PRESETS.map((p) => {
            const isSelected = filters.minPrice === p.min && filters.maxPrice === p.max;
            return (
              <button
                key={p.label}
                onClick={() => {
                  handlePricePreset(p.min, p.max);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#FAEDCD] font-semibold text-[#2A2923] border border-[#DDCBA4]'
                    : 'text-[#686558] hover:bg-[#FAEDCD]/40'
                }`}
              >
                <span>{p.label}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#D4A373]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2A2923]">Size</h4>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map((sz) => (
            <button
              key={sz}
              onClick={() => {
                dispatch(setSize(sz));
                if (onCloseMobile) onCloseMobile();
              }}
              className={`px-3 py-1 text-xs rounded-sm border transition-colors ${
                filters.size === sz
                  ? 'bg-[#D4A373] text-white border-[#D4A373] font-semibold'
                  : 'bg-white text-[#2A2923] border-[#DDCBA4] hover:bg-[#FAEDCD]'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Color Palette */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2A2923]">Color</h4>
        <div className="space-y-1">
          {COLORS.map((clr) => (
            <button
              key={clr}
              onClick={() => {
                dispatch(setColor(clr));
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                filters.color === clr
                  ? 'bg-[#E9EDC9] font-semibold text-[#2A2923]'
                  : 'text-[#686558] hover:bg-[#FAEDCD]/50'
              }`}
            >
              <span>{clr}</span>
              {filters.color === clr && <span className="w-1.5 h-1.5 rounded-full bg-[#2A2923]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="pt-2 border-t border-[#DDCBA4]/40">
        <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-[#2A2923]">
          <input
            type="checkbox"
            checked={filters.availability}
            onChange={(e) => {
              dispatch(setAvailability(e.target.checked));
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-4 h-4 rounded text-[#D4A373] focus:ring-[#D4A373] border-[#DDCBA4]"
          />
          <span>In Stock Only</span>
        </label>
      </div>

      {isMobile && onCloseMobile && (
        <div className="pt-4">
          <Button variant="primary" size="sm" className="w-full" onClick={onCloseMobile}>
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductFilter;
