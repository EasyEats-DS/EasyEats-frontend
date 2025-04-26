
import React from 'react';
import { cn } from "../lib/utils";

const FoodieInput = ({ 
  label, 
  icon, 
  error, 
  className, 
  ...props 
}) => {
  return (
    <div className="mb-4 w-full">
      {label && (
        <label className="block text-gray-700 font-medium mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={cn(
            "w-full bg-gray-50 rounded-lg px-4 py-3 border transition-all",
            "focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/50 focus:border-[#FF7A00]",
            icon && "pl-12",
            error ? "border-red-500" : "border-gray-200",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default FoodieInput;
