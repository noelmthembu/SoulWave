import React from 'react';

interface ContentGridProps {
  loading: boolean;
  loadingLabel: string;
  isEmpty: boolean;
  emptyState?: React.ReactNode;
  skeletonCount?: number;
  /** Three columns for the home page sections, four for full library pages. */
  columns?: 3 | 4;
  children: React.ReactNode;
}

const ContentGrid: React.FC<ContentGridProps> = ({
  loading,
  loadingLabel,
  isEmpty,
  emptyState,
  skeletonCount = 8,
  columns = 4,
  children,
}) => {
  const gridClasses = `grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 ${
    columns === 4 ? 'lg:grid-cols-3 xl:grid-cols-4' : 'lg:grid-cols-3'
  }`;

  if (loading) {
    return (
      <div className={gridClasses} role="status" aria-live="polite">
        {Array.from({ length: skeletonCount }, (_, index) => (
          <div key={index} className="aspect-[4/5] animate-pulse border border-brand-border bg-brand-raised" />
        ))}
        <span className="sr-only">{loadingLabel}</span>
      </div>
    );
  }

  if (isEmpty && emptyState) return <>{emptyState}</>;

  return <div className={gridClasses}>{children}</div>;
};

export default ContentGrid;
