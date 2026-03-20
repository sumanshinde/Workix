'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  motionProps?: HTMLMotionProps<"button">;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className = "", 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    leftIcon, 
    rightIcon, 
    children, 
    disabled,
    motionProps,
    ...props 
  }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60 disabled:pointer-events-none";
    
    const variants: Record<ButtonVariant, string> = {
      primary: "bg-[#2563eb] text-white hover:bg-[#1d4ed8]",
      secondary: "bg-white border border-[#e5e7eb] text-[#111827] hover:bg-gray-50",
      outline: "border border-[#e5e7eb] bg-white text-[#4b5563] hover:bg-gray-50 hover:text-[#111827]",
      ghost: "bg-transparent text-[#6b7280] hover:bg-gray-50 hover:text-[#111827]",
      danger: "bg-[#ef4444] text-white hover:bg-[#dc2626]",
    };

    const sizes: Record<ButtonSize, string> = {
      sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
      md: "h-10 px-4 text-sm rounded-lg gap-3",
      lg: "h-11 px-5 text-sm rounded-lg gap-3",
      icon: "h-10 w-10 p-0 rounded-lg",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
