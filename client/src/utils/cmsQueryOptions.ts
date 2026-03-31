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
  refetchOnMount: true,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  refetchInterval: 50 * 60 * 1000, // 50 minutes — ensures signed URLs (60min validity) stay fresh
  staleTime: 45 * 60 * 1000, // 45 minutes — consider data fresh for 45 min to reduce API calls
});
