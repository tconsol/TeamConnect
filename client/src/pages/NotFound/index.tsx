import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 Page Not Found | TCON Solutions</title>
        <meta name="description" content="The page you're looking for doesn't exist or has been moved." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <section className="min-h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 bg-glow-indigo opacity-20" />
        <div className="relative z-10 text-center container-custom">
          <div className="text-[8rem] md:text-[12rem] font-bold gradient-text leading-none">404</div>
          <h1 className="text-3xl font-bold text-text-heading mt-4 mb-4">Page Not Found</h1>
          <p className="text-text-body max-w-md mx-auto mb-8">
            The page you're looking for doesn't exist or has been moved to a new location.
          </p>
          <Link to="/">
            <Button size="lg">Back to Home</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
