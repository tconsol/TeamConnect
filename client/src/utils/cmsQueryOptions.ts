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
  refetchOnMount: false,        // Don't refetch if data is still fresh — prevents extra API calls on every page visit
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  staleTime: 30 * 60 * 1000,   // 30 min — content doesn't change that often
  gcTime: 60 * 60 * 1000,      // Keep in cache for 1 hour
  refetchInterval: 50 * 60 * 1000, // Background refresh before GCP signed URL expiry
});
