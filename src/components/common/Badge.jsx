import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const variants = {
    default: 'bg-[#FAEDCD] text-[#2A2923] border border-[#DDCBA4]',
    sage: 'bg-[#CCD5AE]/60 text-[#2A2923] border border-[#CCD5AE]',
    accent: 'bg-[#D4A373]/20 text-[#9E6D3B] border border-[#D4A373]/40',
    cream: 'bg-[#E9EDC9] text-[#2A2923] border border-[#dce3b2]',
    // Order Statuses
    pending: 'bg-amber-50 text-amber-800 border border-amber-200',
    confirmed: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    processing: 'bg-blue-50 text-blue-800 border border-blue-200',
    shipped: 'bg-purple-50 text-purple-800 border border-purple-200',
    out_for_delivery: 'bg-indigo-50 text-indigo-800 border border-indigo-200',
    delivered: 'bg-teal-50 text-teal-800 border border-teal-200',
    cancelled: 'bg-red-50 text-red-700 border border-red-200',
    // Stock Statuses
    inStock: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    lowStock: 'bg-amber-50 text-amber-700 border border-amber-300 font-medium',
    outOfStock: 'bg-stone-100 text-stone-500 border border-stone-200',
    // Discount
    discount: 'bg-[#C86D51] text-white font-semibold',
  };

  const sizes = {
    xs: 'text-[10px] px-2 py-0.5 rounded-full',
    sm: 'text-xs px-2.5 py-0.5 rounded-full',
    md: 'text-sm px-3 py-1 rounded-full',
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-medium capitalize tracking-wide transition-colors ${variants[variant] || variants.default} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
