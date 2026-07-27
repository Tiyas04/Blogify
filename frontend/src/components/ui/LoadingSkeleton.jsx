import React from 'react';

// Single standard Pulse Row
export const SkeletonPulse = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-md ${className}`} />
  );
};

// Shimmering layout matching standard Blog Cards
export const BlogCardSkeleton = () => {
  return (
    <div className="bg-bg-surface border border-border-base rounded-2xl overflow-hidden flex flex-col h-full">
      {/* Cover image area */}
      <SkeletonPulse className="w-full h-48 sm:h-52 rounded-none" />
      
      {/* Detail Area */}
      <div className="p-6 flex flex-col grow justify-between">
        <div>
          {/* Metadata */}
          <div className="flex gap-4 mb-3">
            <SkeletonPulse className="w-16 h-3" />
            <SkeletonPulse className="w-12 h-3" />
          </div>
          {/* Title */}
          <SkeletonPulse className="w-full h-6 mb-3" />
          <SkeletonPulse className="w-4/5 h-6 mb-4" />
          {/* Paragraphs */}
          <SkeletonPulse className="w-full h-3 mb-2" />
          <SkeletonPulse className="w-11/12 h-3 mb-2" />
          <SkeletonPulse className="w-3/4 h-3 mb-4" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border-base pt-4">
          <div className="flex items-center gap-2.5">
            <SkeletonPulse className="w-8 h-8 rounded-full" />
            <SkeletonPulse className="w-16 h-3" />
          </div>
          <div className="flex gap-3">
            <SkeletonPulse className="w-8 h-4" />
            <SkeletonPulse className="w-8 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Shimmering layout matching Featured Cards
export const FeaturedCardSkeleton = () => {
  return (
    <div className="bg-bg-surface border border-border-base rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-87.5">
      {/* Cover image area */}
      <SkeletonPulse className="md:w-1/2 h-56 sm:h-auto rounded-none shrink-0" />

      {/* Details */}
      <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between grow">
        <div>
          {/* Metadata */}
          <div className="flex gap-4 mb-4">
            <SkeletonPulse className="w-20 h-4" />
            <SkeletonPulse className="w-16 h-4" />
          </div>
          {/* Title */}
          <SkeletonPulse className="w-full h-8 mb-3" />
          <SkeletonPulse className="w-5/6 h-8 mb-4" />
          {/* Description */}
          <SkeletonPulse className="w-full h-4 mb-2" />
          <SkeletonPulse className="w-11/12 h-4 mb-2" />
          <SkeletonPulse className="w-3/4 h-4 mb-6" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border-base pt-4">
          <div className="flex items-center gap-3">
            <SkeletonPulse className="w-10 h-10 rounded-full" />
            <div>
              <SkeletonPulse className="w-24 h-4 mb-1" />
              <SkeletonPulse className="w-12 h-3" />
            </div>
          </div>
          <div className="flex gap-4">
            <SkeletonPulse className="w-12 h-4" />
            <SkeletonPulse className="w-12 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Shimmering detail reader screen
export const BlogDetailSkeleton = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 font-body">
      {/* Back button */}
      <SkeletonPulse className="w-24 h-8 mb-6" />

      {/* Category */}
      <SkeletonPulse className="w-20 h-5 mb-4" />

      {/* Title */}
      <SkeletonPulse className="w-full h-12 mb-4" />
      <SkeletonPulse className="w-4/5 h-12 mb-6" />

      {/* Author and stats bar */}
      <div className="flex items-center justify-between border-y border-border-base py-4 mb-8">
        <div className="flex items-center gap-3">
          <SkeletonPulse className="w-12 h-12 rounded-full" />
          <div>
            <SkeletonPulse className="w-28 h-4 mb-1.5" />
            <SkeletonPulse className="w-20 h-3" />
          </div>
        </div>
        <div className="flex gap-4">
          <SkeletonPulse className="w-10 h-8" />
          <SkeletonPulse className="w-10 h-8" />
        </div>
      </div>

      {/* Cover Image */}
      <SkeletonPulse className="w-full h-64 sm:h-100 rounded-2xl mb-8" />

      {/* Body sentences */}
      <div className="flex flex-col gap-3">
        <SkeletonPulse className="w-full h-4" />
        <SkeletonPulse className="w-11/12 h-4" />
        <SkeletonPulse className="w-full h-4" />
        <SkeletonPulse className="w-5/6 h-4" />
        <SkeletonPulse className="w-10/12 h-4" />
        <div className="h-6" /> {/* spacer */}
        <SkeletonPulse className="w-full h-4" />
        <SkeletonPulse className="w-full h-4" />
        <SkeletonPulse className="w-11/12 h-4" />
        <SkeletonPulse className="w-2/3 h-4" />
      </div>
    </div>
  );
};

// Global Grid Wrapper
const LoadingSkeleton = ({ count = 3, type = 'card' }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
