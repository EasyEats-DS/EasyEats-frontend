
import React from 'react';
import { cn } from "../lib/utils";

const FoodieButton = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  className, 
  ...props 
}) => {
  const baseStyles = "font-medium rounded-full transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center";
  
  const variants = {
    primary: "bg-gradient-to-r from-[#FF7A00] to-[#FF9E00] text-white shadow-md hover:shadow-lg",
    secondary: "bg-white border-2 border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00]/5",
    outline: "bg-transparent border-2 border-gray-700 text-gray-800 hover:border-[#FF7A00]",
    ghost: "bg-transparent text-gray-800 hover:bg-gray-100",
  };
  
  const sizes = {
    sm: "text-sm py-2 px-4",
    md: "py-3 px-6",
    lg: "text-lg py-4 px-8",
  };

  return (
    <button 
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default FoodieButton;