import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import PageTransition from './PageTransition';
import ScrollProgress from '@/components/ui/ScrollProgress';

export default function Layout() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="min-h-screen">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </>
  );
}
