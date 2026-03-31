import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { router } from '@/routes';
import { useLenis } from '@/hooks/useAnimations';
import CustomCursor from '@/components/ui/CustomCursor';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});

function App() {
  useLenis();

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <CustomCursor />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
