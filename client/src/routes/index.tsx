import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { PageSkeleton } from '@/components/ui/Skeleton';

const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const Services = lazy(() => import('@/pages/Services'));
const Solutions = lazy(() => import('@/pages/Solutions'));
const Portfolio = lazy(() => import('@/pages/Portfolio'));
const PortfolioDetails = lazy(() => import('@/pages/PortfolioDetails'));
const Careers = lazy(() => import('@/pages/Careers'));
const Contact = lazy(() => import('@/pages/Contact'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const Loader = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Loader><Home /></Loader> },
      { path: 'about', element: <Loader><About /></Loader> },
      { path: 'services', element: <Loader><Services /></Loader> },
      { path: 'solutions', element: <Loader><Solutions /></Loader> },
      { path: 'portfolio', element: <Loader><Portfolio /></Loader> },
      { path: 'portfolio/:slug', element: <Loader><PortfolioDetails /></Loader> },
      { path: 'careers', element: <Loader><Careers /></Loader> },
      { path: 'contact', element: <Loader><Contact /></Loader> },
      { path: '*', element: <Loader><NotFound /></Loader> },
    ],
  },
]);
