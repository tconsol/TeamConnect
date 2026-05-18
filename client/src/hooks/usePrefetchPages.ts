import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { cmsQueryOptions } from '@/utils/cmsQueryOptions';
import { fetchServices, fetchSkills, fetchPortfolios, fetchJobs } from '@/utils/api';

export const usePrefetchPages = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Delay all prefetching until the browser is idle AND the page has fully painted.
    // This ensures prefetch requests never compete with FCP/LCP network fetches.
    const schedule = (cb: () => void) => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(cb, { timeout: 5000 });
      } else {
        setTimeout(cb, 3000);
      }
    };

    schedule(async () => {
      // Only prefetch pages the user hasn't visited yet (skip if already cached)
      const cmsPages = ['home', 'about', 'services', 'solutions', 'portfolio', 'careers', 'contact'] as const;

      // Fire sequentially in small batches to avoid network congestion
      for (const page of cmsPages) {
        const opts = cmsQueryOptions(page as any);
        const cached = queryClient.getQueryData(opts.queryKey);
        if (!cached) {
          queryClient.prefetchQuery({ queryKey: opts.queryKey, queryFn: opts.queryFn });
          // Small gap between each to avoid burst
          await new Promise(r => setTimeout(r, 150));
        }
      }

      // Prefetch list data only if not already in cache
      const listQueries = [
        { queryKey: ['services'], queryFn: fetchServices },
        { queryKey: ['skills'],   queryFn: fetchSkills   },
        { queryKey: ['portfolios'], queryFn: () => fetchPortfolios() },
        { queryKey: ['jobs'],     queryFn: fetchJobs     },
      ];

      for (const q of listQueries) {
        if (!queryClient.getQueryData(q.queryKey)) {
          queryClient.prefetchQuery(q);
          await new Promise(r => setTimeout(r, 200));
        }
      }
    });
  }, [queryClient]);
};
