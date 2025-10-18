"use client";

export default function SkeletonLoader({ type = 'card', className = '' }) {
  const getSkeletonClasses = () => {
    const baseClasses = 'skeleton-shimmer bg-gray-200 rounded';
    
    switch (type) {
      case 'card':
        return `${baseClasses} h-80 w-full`;
      case 'image':
        return `${baseClasses} aspect-square w-full`;
      case 'text':
        return `${baseClasses} h-4 w-3/4`;
      case 'title':
        return `${baseClasses} h-6 w-1/2`;
      case 'button':
        return `${baseClasses} h-10 w-full`;
      case 'category':
        return `${baseClasses} aspect-square w-full rounded-full`;
      default:
        return `${baseClasses} h-20 w-full`;
    }
  };

  if (type === 'card') {
    return (
      <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
        <div className={`${getSkeletonClasses()} mb-4`}></div>
        <div className="p-4 space-y-3">
          <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return <div className={`${getSkeletonClasses()} ${className}`}></div>;
}
