import React from 'react';

export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-gray-100 ${className}`}>
      {children}
    </div>
  );
}
