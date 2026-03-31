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
  refetchOnMount: 'always' as const,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  refetchInterval: 30_000,
});
