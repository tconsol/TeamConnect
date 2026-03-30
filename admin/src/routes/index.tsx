import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';

const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const CMS = lazy(() => import('@/pages/CMS'));
const Services = lazy(() => import('@/pages/Services'));
const Portfolio = lazy(() => import('@/pages/Portfolio'));
const Careers = lazy(() => import('@/pages/Careers'));
const Applications = lazy(() => import('@/pages/Applications'));
const Leads = lazy(() => import('@/pages/Leads'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-accent-indigo border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function SuspenseWrap({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <SuspenseWrap><Login /></SuspenseWrap>,
  },
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <SuspenseWrap><Dashboard /></SuspenseWrap> },
      { path: 'cms', element: <SuspenseWrap><CMS /></SuspenseWrap> },
      { path: 'services', element: <SuspenseWrap><Services /></SuspenseWrap> },
      { path: 'portfolio', element: <SuspenseWrap><Portfolio /></SuspenseWrap> },
      { path: 'careers', element: <SuspenseWrap><Careers /></SuspenseWrap> },
      { path: 'applications', element: <SuspenseWrap><Applications /></SuspenseWrap> },
      { path: 'leads', element: <SuspenseWrap><Leads /></SuspenseWrap> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
