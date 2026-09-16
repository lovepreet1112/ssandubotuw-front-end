import React from 'react';
import { InlineLoader } from './Loader';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A373] focus-visible:ring-offset-2';

  const variants = {
    primary:
      'bg-[#D4A373] hover:bg-[#c28f5e] text-white shadow-sm hover:shadow-warm-sm border border-transparent',
    secondary:
      'bg-[#CCD5AE] hover:bg-[#bcc79b] text-[#2A2923] border border-transparent',
    warm:
      'bg-[#FAEDCD] hover:bg-[#f5e4ba] text-[#2A2923] border border-[#DDCBA4]',
    outline:
      'border border-[#D4A373] text-[#D4A373] hover:bg-[#D4A373] hover:text-white',
    dark:
      'bg-[#2A2923] hover:bg-[#1f1e1a] text-white shadow-sm',
    ghost:
      'text-[#2A2923] hover:bg-[#FAEDCD]/60',
    danger:
      'bg-[#C86D51] hover:bg-[#b05a3f] text-white',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded-sm gap-1.5',
    md: 'text-sm px-5 py-2.5 rounded-sm gap-2',
    lg: 'text-base px-7 py-3.5 rounded-sm gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <InlineLoader size="sm" color={variant === 'primary' || variant === 'dark' || variant === 'danger' ? 'white' : 'dark'} />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
};

export default Button;
