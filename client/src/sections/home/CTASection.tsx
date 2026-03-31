import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useGsapFadeIn } from '@/hooks/useAnimations';
import { cmsQueryOptions } from '@/utils/cmsQueryOptions';
import { AuroraTextEffect } from '@/components/ui/AuroraTextEffect';
import Button from '@/components/ui/Button';

export default function CTASection() {
  const ref = useGsapFadeIn();

  const { data: cms } = useQuery(cmsQueryOptions('home'));

  const cta = cms?.content?.cta;

  return (
    <section className="relative py-16 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-glow-violet opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-violet/[0.08] rounded-full blur-[150px]" />
      <div className="absolute inset-0 line-grid opacity-20" />

      <div ref={ref} className="container-custom relative z-10 text-center">
        <h2 className="text-display font-bold text-text-heading mb-6 text-balance">
          {cta?.title ? (
            <>
              {cta.title.split('?')[0]}
              <AuroraTextEffect text="?" />
            </>
          ) : (
            <>
              Ready to Build Something{' '}
              <AuroraTextEffect text="Extraordinary" />?
            </>
          )}
        </h2>
        <p className="text-subtitle text-text-body max-w-2xl mx-auto mb-12 leading-relaxed">
          {cta?.subtitle || "Let's discuss how we can help transform your vision into a stunning digital reality."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact">
            <Button size="lg">
              {cta?.buttonText || 'Start a Conversation'}
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
