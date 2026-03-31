import React, { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt: string;
  src: string;
  cmsPage?: 'home' | 'about' | 'services' | 'solutions' | 'portfolio' | 'careers' | 'contact';
  fallback?: string;
}

/**
 * OptimizedImage detects broken images (e.g., expired signed URLs)
 * and automatically triggers a data refresh to get fresh signed URLs
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  alt,
  src,
  cmsPage,
  fallback,
  onError,
  ...props
}) => {
  const [imageBroken, setImageBroken] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const queryClient = useQueryClient();

  const handleImageError = useCallback(() => {
    if (retryCount >= 2) {
      // Stop after 2 retries to avoid infinite loops
      setImageBroken(true);
      onError?.(new Event('error') as any);
      return;
    }

    // Signed URL expired — trigger refresh
    if (cmsPage) {
      console.warn(`Image failed to load (expired URL?), refetching CMS data for ${cmsPage}...`);
      queryClient.invalidateQueries({ queryKey: ['cms', cmsPage] });
    }

    setRetryCount(prev => prev + 1);
  }, [retryCount, cmsPage, queryClient, onError]);

  if (imageBroken) {
    return (
      fallback ? (
        <img alt={alt} src={fallback} {...props} />
      ) : (
        <div
          className="bg-gray-200 flex items-center justify-center"
          style={{
            width: props.width || '100%',
            height: props.height || '200px',
          }}
        >
          <span className="text-gray-500 text-sm">Image unavailable</span>
        </div>
      )
    );
  }

  return (
    <img
      alt={alt}
      src={src}
      onError={handleImageError}
      {...props}
    />
  );
};
