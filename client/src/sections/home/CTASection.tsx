import { Link } from 'react-router-dom';
import { useGsapFadeIn } from '@/hooks/useAnimations';
import Button from '@/components/ui/Button';

export default function CTASection() {
  const ref = useGsapFadeIn();

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-glow-indigo opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-indigo/10 rounded-full blur-[150px]" />

      <div ref={ref} className="container-custom relative z-10 text-center">
        <h2 className="text-display font-bold text-text-heading mb-6 text-balance">
          Ready to Build Something{' '}
          <span className="gradient-text">Extraordinary</span>?
        </h2>
        <p className="text-subtitle text-text-body max-w-2xl mx-auto mb-10 leading-relaxed">
          Let's collaborate to create a digital experience that sets you apart.
          Our team is ready to turn your vision into reality.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact">
            <Button size="lg">
              Start a Project
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Button>
          </Link>
          <Link to="/portfolio">
            <Button variant="secondary" size="lg">
              View Portfolio
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
