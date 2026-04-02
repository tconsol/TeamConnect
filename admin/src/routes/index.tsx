import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import { useAuth } from '@/hooks/useAuth';

const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const CMS = lazy(() => import('@/pages/CMS'));
const Services = lazy(() => import('@/pages/Services'));
const Skills = lazy(() => import('@/pages/Skills'));
const Portfolio = lazy(() => import('@/pages/Portfolio'));
const Careers = lazy(() => import('@/pages/Careers'));
const Applications = lazy(() => import('@/pages/Applications'));
const Users = lazy(() => import('@/pages/Users'));
const Leads = lazy(() => import('@/pages/Leads'));
const Testimonials = lazy(() => import('@/pages/Testimonials'));
const Profile = lazy(() => import('@/pages/Profile'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-accent-indigo border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-primary">
        <div className="w-8 h-8 border-2 border-accent-indigo border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <AdminLayout />;
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
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <SuspenseWrap><Dashboard /></SuspenseWrap> },
      { path: 'cms', element: <SuspenseWrap><CMS /></SuspenseWrap> },
      { path: 'services', element: <SuspenseWrap><Services /></SuspenseWrap> },
      { path: 'skills', element: <SuspenseWrap><Skills /></SuspenseWrap> },
      { path: 'portfolio', element: <SuspenseWrap><Portfolio /></SuspenseWrap> },
      { path: 'careers', element: <SuspenseWrap><Careers /></SuspenseWrap> },
      { path: 'applications', element: <SuspenseWrap><Applications /></SuspenseWrap> },
      { path: 'users', element: <SuspenseWrap><Users /></SuspenseWrap> },
      { path: 'leads', element: <SuspenseWrap><Leads /></SuspenseWrap> },
      { path: 'testimonials', element: <SuspenseWrap><Testimonials /></SuspenseWrap> },
      { path: 'profile', element: <SuspenseWrap><Profile /></SuspenseWrap> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
], {
  // @ts-expect-error — v7_startTransition exists at runtime but types lag behind
  future: { v7_startTransition: true },
});
