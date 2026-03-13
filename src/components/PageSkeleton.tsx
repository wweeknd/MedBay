import React, { useEffect, useState } from 'react';

/**
 * Skeleton loaders — animated shimmer placeholders shown while a page
 * "loads". Not Minecraft blocks! Think of how YouTube shows grey
 * blurry rectangles before a video thumbnail loads. Same idea here.
 *
 * Usage: wrap a page with <PageSkeleton delay={400}>…children…</PageSkeleton>
 * It shows the shimmer for `delay` ms then fades in the real content.
 */

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Single shimmer block */
export const SkeletonBlock: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius = 'var(--radius-md)',
  className = '',
  style,
}) => (
  <div
    className={`skeleton-block ${className}`}
    style={{ width, height, borderRadius, ...style }}
  />
);

/** Full dashboard skeleton — stat cards + two content cards */
export const DashboardSkeleton: React.FC = () => (
  <div className="page-inner skeleton-page">
    {/* Hero gradient placeholder */}
    <div className="skeleton-hero" />

    {/* Stat cards */}
    <div className="grid-3" style={{ marginBottom: 'var(--space-2xl)' }}>
      {[1, 2, 3].map(i => (
        <div key={i} className="skeleton-card">
          <SkeletonBlock width="48px" height="48px" borderRadius="var(--radius-lg)" />
          <SkeletonBlock width="60px" height="2rem" style={{ marginTop: '1rem' } as React.CSSProperties} />
          <SkeletonBlock width="120px" height="0.875rem" style={{ marginTop: '0.5rem' } as React.CSSProperties} />
        </div>
      ))}
    </div>

    {/* Content grid */}
    <div className="dashboard-grid">
      <div className="skeleton-card skeleton-card-tall">
        <SkeletonBlock height="1.25rem" width="60%" />
        <SkeletonBlock height="1rem" width="80%" style={{ marginTop: '1rem' } as React.CSSProperties} />
        <SkeletonBlock height="1rem" width="70%" style={{ marginTop: '0.5rem' } as React.CSSProperties} />
        <SkeletonBlock height="1rem" width="90%" style={{ marginTop: '0.5rem' } as React.CSSProperties} />
        <SkeletonBlock height="1rem" width="50%" style={{ marginTop: '0.5rem' } as React.CSSProperties} />
      </div>
      <div className="skeleton-card skeleton-card-tall">
        <SkeletonBlock height="1.25rem" width="50%" />
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '1rem' }}>
            <SkeletonBlock width="42px" height="42px" borderRadius="var(--radius-lg)" />
            <div style={{ flex: 1 }}>
              <SkeletonBlock height="0.875rem" width="70%" />
              <SkeletonBlock height="0.75rem" width="50%" style={{ marginTop: '0.375rem' } as React.CSSProperties} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * Wraps page content: shows skeleton for `delay` ms, then cross-fades
 * to real children.
 */
interface PageSkeletonProps {
  delay?: number;
  skeleton?: React.ReactNode;
  children: React.ReactNode;
}

const PageSkeleton: React.FC<PageSkeletonProps> = ({
  delay = 600,
  skeleton = <DashboardSkeleton />,
  children,
}) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <>
      {!ready && <div className="skeleton-wrapper">{skeleton}</div>}
      {ready && <div className="skeleton-reveal">{children}</div>}
    </>
  );
};

export default PageSkeleton;
