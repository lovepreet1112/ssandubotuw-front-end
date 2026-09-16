import React from 'react';
import { PackageOpen } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No Items Found',
  description = 'We could not find anything matching your request at the moment.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 md:p-14 text-center bg-white/70 border border-[#DDCBA4]/60 rounded-md my-4 ${className}`}
    >
      <div className="w-16 h-16 rounded-full bg-[#FAEDCD] flex items-center justify-center text-[#D4A373] mb-4 shadow-sm">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-serif font-semibold text-[#2A2923] mb-2">{title}</h3>
      <p className="text-sm text-[#686558] max-w-md mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
