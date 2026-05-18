import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { router } from '@/routes';
import { useLenis } from '@/hooks/useAnimations';
import { usePrefetchPages } from '@/hooks/usePrefetchPages';
import CustomCursor from '@/components/ui/CustomCursor';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 min avoids redundant refetches on revisit
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false, // no background refetch on tab focus
    },
  },
});

function AppContent() {
  useLenis();
  usePrefetchPages();

  return (
    <>
      <CustomCursor />
      <RouterProvider router={router} />
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
