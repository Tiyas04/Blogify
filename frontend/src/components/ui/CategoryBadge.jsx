import React from 'react';

const CategoryBadge = ({ category, className = '', onClick }) => {
  if (!category) return null;

  const baseStyles = 'inline-flex items-center px-3 py-1 rounded-[8px] text-[10px] font-medium uppercase tracking-wider border font-brand transition-all duration-200 select-none';
  const badgeColors = 'bg-bg-base text-text-secondary border-border-base';
  const interactionStyles = onClick 
    ? 'cursor-pointer hover:bg-bg-surface hover:text-text-primary hover:border-text-primary hover:-translate-y-0.5 hover:shadow-sm active:scale-95' 
    : '';

  return (
    <span
      className={`${baseStyles} ${badgeColors} ${interactionStyles} ${className}`}
      onClick={onClick}
    >
      {category}
    </span>
  );
};

export default CategoryBadge;
