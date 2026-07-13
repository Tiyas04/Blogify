import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange, className = '' }) => {
  if (totalPages <= 1) return null;

  // Generate page numbers
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav className={`flex items-center justify-center gap-2 mt-10 font-heading select-none ${className}`}>
      {/* Previous button */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 border border-border-base rounded-[12px] bg-bg-surface hover:bg-bg-base text-text-primary hover:text-accent-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer disabled:hover:text-text-primary disabled:hover:bg-bg-surface active:scale-95"
        title="Previous Page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Pages List */}
      <div className="flex items-center gap-1.5">
        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`w-10 h-10 rounded-[12px] flex items-center justify-center font-bold text-sm border transition-all duration-200 cursor-pointer active:scale-95
                ${isActive
                  ? 'bg-accent-primary text-white dark:text-slate-950 border-accent-primary shadow-sm'
                  : 'bg-bg-surface text-text-secondary border-border-base hover:text-text-primary hover:border-text-primary'
                }
              `}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 border border-border-base rounded-[12px] bg-bg-surface hover:bg-bg-base text-text-primary hover:text-accent-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer disabled:hover:text-text-primary disabled:hover:bg-bg-surface active:scale-95"
        title="Next Page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
};

export default Pagination;
