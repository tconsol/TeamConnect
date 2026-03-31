import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { cmsQueryOptions } from '@/utils/cmsQueryOptions';
import { fetchServices, fetchSkills, fetchPortfolios, fetchJobs } from '@/utils/api';

export const usePrefetchPages = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const prefetchAllData = async () => {
      try {
        // Prefetch all CMS pages
        const cmsPages = ['home', 'about', 'services', 'solutions', 'portfolio', 'careers', 'contact'] as const;
        
        await Promise.all([
          // Prefetch CMS data for all pages
          ...cmsPages.map(page => 
            queryClient.prefetchQuery({
              queryKey: cmsQueryOptions(page as any).queryKey,
              queryFn: cmsQueryOptions(page as any).queryFn,
            })
          ),
          // Prefetch services
          queryClient.prefetchQuery({
            queryKey: ['services'],
            queryFn: fetchServices,
          }),
          // Prefetch skills
          queryClient.prefetchQuery({
            queryKey: ['skills'],
            queryFn: fetchSkills,
          }),
          // Prefetch portfolios
          queryClient.prefetchQuery({
            queryKey: ['portfolios'],
            queryFn: () => fetchPortfolios(),
          }),
          // Prefetch jobs
          queryClient.prefetchQuery({
            queryKey: ['jobs'],
            queryFn: fetchJobs,
          }),
        ]);

        console.log('✅ All pages data prefetched successfully');
      } catch (error) {
        console.error('❌ Error prefetching pages data:', error);
      }
    };

    prefetchAllData();
  }, [queryClient]);
};
