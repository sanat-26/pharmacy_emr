import React from 'react';

export default function Badge({ children, type = 'default' }) {
  const types = {
    active: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    warning: "bg-amber-50 text-amber-600 border border-amber-100",
    danger: "bg-red-50 text-red-600 border border-red-100",
    neutral: "bg-gray-50 text-gray-600 border border-gray-100",
    default: "bg-blue-50 text-blue-600 border border-blue-100"
  };
  
  // Try to map raw statuses to types
  let activeType = type;
  if (type === 'Active') activeType = 'active';
  if (type === 'Low Stock' || type === 'Pending') activeType = 'warning';
  if (type === 'Expired' || type === 'Out of Stock') activeType = 'danger';
  if (type === 'Completed') activeType = 'active';

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${types[activeType] || types.default}`}>
      {children}
    </span>
  );
}
