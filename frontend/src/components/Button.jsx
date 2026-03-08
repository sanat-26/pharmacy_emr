import React from 'react';

export default function Button({ children, variant = 'primary', icon, onClick, className = "" }) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg text-sm px-4 py-2 transition-colors";
  
  const variants = {
    primary: "bg-[#1877f2] hover:bg-blue-600 text-white shadow-sm",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200",
    outline: "bg-transparent text-gray-600 border border-gray-200 hover:bg-gray-50"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}
