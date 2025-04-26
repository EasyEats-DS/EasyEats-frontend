
import React from 'react';
import { cn } from "../lib/utils";

const FoodieCard = ({ 
  children, 
  className, 
  interactive = true,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl p-5 shadow-md",
        interactive && "transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default FoodieCard;
