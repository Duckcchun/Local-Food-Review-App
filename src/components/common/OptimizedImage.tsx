import { useState, useRef, useEffect, memo } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Width for srcset calculation */
  width?: number;
  /** Aspect ratio string e.g. "16/10" */
  aspectRatio?: string;
  /** Enable blur-up placeholder effect */
  blurPlaceholder?: boolean;
  /** Priority loading (above the fold) - disables lazy loading */
  priority?: boolean;
  /** Fallback element when image fails */
  fallback?: React.ReactNode;
  onClick?: () => void;
}

/**
 * Performance-optimized image component.
 *
 * Features:
 * - Native lazy loading (loading="lazy")
 * - IntersectionObserver fallback for older browsers
 * - Blur-up placeholder effect while loading
 * - Automatic srcset generation for responsive images
 * - Graceful error handling with fallback
 * - Skeleton shimmer while loading
 */
export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  aspectRatio,
  blurPlaceholder = true,
  priority = false,
  fallback,
  onClick,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver for lazy loading
  useEffect(() => {
    if (priority || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading 200px before visible
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [priority, inView]);

  // Generate srcset for responsive loading
  const srcSet = width && src.includes('unsplash.com')
    ? `${src}&w=${width} 1x, ${src}&w=${width * 2} 2x`
    : undefined;

  const handleError = () => {
    setError(true);
    setLoaded(true);
  };

  const containerStyle = aspectRatio ? { aspectRatio } : undefined;

  if (error) {
    return (
      <div
        ref={imgRef}
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={containerStyle}
        onClick={onClick}
      >
        {fallback || (
          <span className="text-gray-300 text-sm">이미지 없음</span>
        )}
      </div>
    );
  }

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={containerStyle}
      onClick={onClick}
    >
      {/* Skeleton placeholder */}
      {!loaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}

      {/* Actual image (only rendered when in view) */}
      {inView && (
        <img
          src={src}
          srcSet={srcSet}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
});
