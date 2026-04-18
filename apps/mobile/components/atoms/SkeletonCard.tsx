import React from 'react';

/**
 * Shimmer placeholder that matches ProductCard's dimensions.
 * Shown while the product list is loading (initial mount + refresh).
 */
export default function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#111C11', border: '1px solid rgba(245,240,232,0.05)' }}
    >
      {/* Image area */}
      <div
        className="h-60 animate-pulse"
        style={{ background: 'rgba(245,240,232,0.05)' }}
      />

      {/* Info strip */}
      <div className="px-5 py-4 space-y-3">
        {/* Variety label skeleton */}
        <div
          className="h-2.5 w-1/4 rounded-full animate-pulse"
          style={{ background: 'rgba(245,240,232,0.06)', animationDelay: '80ms' }}
        />
        {/* Name skeleton */}
        <div
          className="h-5 w-3/5 rounded-full animate-pulse"
          style={{ background: 'rgba(245,240,232,0.07)', animationDelay: '120ms' }}
        />
        {/* Price skeleton */}
        <div className="flex items-center justify-between mt-1">
          <div
            className="h-7 w-1/3 rounded-full animate-pulse"
            style={{ background: 'rgba(245,240,232,0.06)', animationDelay: '160ms' }}
          />
          <div
            className="w-10 h-10 rounded-full animate-pulse"
            style={{ background: 'rgba(245,240,232,0.05)', animationDelay: '200ms' }}
          />
        </div>
      </div>
    </div>
  );
}
