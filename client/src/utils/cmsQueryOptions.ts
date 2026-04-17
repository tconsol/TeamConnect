import { fetchCMS } from '@/utils/api';

export type CMSPage =
  | 'home'
  | 'about'
  | 'services'
  | 'solutions'
  | 'portfolio'
  | 'careers'
  | 'contact';

export const cmsQueryOptions = (page: CMSPage) => ({
  queryKey: ['cms', page] as const,
  queryFn: () => fetchCMS(page),
  refetchOnMount: true,         // Refetch on mount to get latest content from admin updates
  refetchOnWindowFocus: false,  // Don't refetch on window focus
  refetchOnReconnect: false,    // Don't refetch on reconnect
  
  // GCP signed URLs expire in 60 minutes
  // Refresh 15 minutes BEFORE expiry to ensure fresh URLs
  staleTime: 30 * 60 * 1000,    // 30 minutes — mark as stale halfway to expiry
  refetchInterval: 50 * 60 * 1000, // 50 minutes — refetch well before 60-min expiry
  
  // If a broken image is detected, refetch immediately
  refetchOnError: true,
});
