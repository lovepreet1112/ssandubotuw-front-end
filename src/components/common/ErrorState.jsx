import React from 'react';
import { AlertCircle } from 'lucide-react';
import Button from './Button';

export const ErrorState = ({
  title = 'Unable to Load',
  message = 'An issue occurred while loading this section. Please try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50/40 border border-red-200/60 rounded-md my-4">
      <div className="w-12 h-12 rounded-full bg-red-100/80 flex items-center justify-center text-[#C86D51] mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-lg font-serif font-medium text-[#2A2923] mb-1">{title}</h4>
      <p className="text-xs md:text-sm text-[#686558] max-w-sm mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
