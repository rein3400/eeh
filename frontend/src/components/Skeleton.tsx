import React from 'react';

type SkeletonVariant = 'page' | 'card' | 'stat';
interface SkeletonProps {
  variant?: SkeletonVariant;
  count?: number;
}

export const PageSkeleton = ({ variant = 'page', count = 4 }: SkeletonProps) => {
  if (variant === 'card') {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded-full w-6 mb-4 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 mx-auto"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
    );
  }

  if (variant === 'stat') {
    return (
      <div className="text-center animate-pulse">
        <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8">
          {/* Header Skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(count)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                <div className="h-6 bg-gray-200 rounded-full w-6 mb-4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 mx-auto"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>

          {/* Stats Skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(count)].map((_, i) => (
                <div key={i} className="text-center">
                  <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
