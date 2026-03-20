'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hint?: string;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className = "", 
    label, 
    error, 
    leftIcon, 
    rightIcon, 
    hint,
    containerClassName = "",
    id,
    disabled = false,
    ...props 
  }, ref) => {
    
    const baseInputStyles = "w-full h-10 bg-white border border-[#e5e7eb] text-[#111827] rounded-lg px-3 text-sm transition-all duration-200 outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/5 placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-400 disabled:pointer-events-none";
    const errorInputStyles = "border-[#ef4444] focus:border-[#ef4444] focus:ring-[#ef4444]/5";
    const iconInputPadding = `${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`;

    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && (
          <label 
            htmlFor={id} 
            className="text-sm font-medium text-[#4b5563] pl-0.5"
          >
            {label}
          </label>
        )}
        
        <div className="relative group">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors pointer-events-none">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={id}
            disabled={disabled}
            className={`
              ${baseInputStyles} 
              ${iconInputPadding} 
              ${error ? errorInputStyles : ''} 
              ${className}
            `}
            {...props}
          />
          
          {rightIcon && (
            <div className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors ${props.type === 'button' ? 'cursor-pointer' : 'pointer-events-none'}`}>
              {rightIcon}
            </div>
          )}
        </div>
        
        {error ? (
          <p className="text-[11px] font-semibold text-rose-500 pl-1">{error}</p>
        ) : hint ? (
          <p className="text-[11px] font-medium text-gray-400 pl-1">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
