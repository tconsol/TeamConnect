import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { gsap } from 'gsap';
import { cmsQueryOptions } from '@/utils/cmsQueryOptions';
import Button from '@/components/ui/Button';
import { AuroraTextEffect } from '@/components/ui/AuroraTextEffect';

const STATS = [
  { value: '150+', label: 'Projects Delivered' },
  { value: '50+', label: 'Happy Clients' },
  { value: '5+', label: 'Years Building' },
  { value: '99%', label: 'Satisfaction' },
];

const PILLARS = [
  { title: 'Strategy + Execution', subtitle: 'From idea to production with one accountable team.' },
  { title: 'Design That Converts', subtitle: 'Product interfaces crafted for clarity and growth.' },
  { title: 'Engineering at Speed', subtitle: 'Modern stacks, reliable delivery, measurable outcomes.' },
];

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const { data: cms } = useQuery(cmsQueryOptions('home'));

  const hero = cms?.content?.hero;
  const stats = cms?.content?.stats?.length ? cms.content.stats : STATS;

  useEffect(() => {
    const mm = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });
      tl.fromTo(
        '.hero-kicker, .hero-title, .hero-subtitle, .hero-ctas, .hero-pillars',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.12, duration: 0.75, ease: 'power3.out' }
      );
      tl.fromTo(
        '.hero-glass-frame',
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.45'
      );
      tl.fromTo(
        statsRef.current,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      );
    }, heroRef);

    return () => mm.revert();
  }, []);

  const title = hero?.title || 'Products That Move Businesses Forward';
  const titleWords = title.split(' ');
  const splitPoint = Math.max(2, Math.ceil(titleWords.length / 2));
  const lead = titleWords.slice(0, splitPoint).join(' ');
  const accent = titleWords.slice(splitPoint).join(' ');

  return (
    <section ref={heroRef} className="relative min-h-screen overflow-hidden flex flex-col justify-between">
      {/* Atmosphere */}
      <div className="absolute inset-0 bg-mesh" />
      <div className="absolute inset-0 line-grid opacity-[0.16]" />
      <div
        className="absolute -top-24 -left-16 w-[520px] h-[520px] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.24) 0%, rgba(34,197,94,0) 70%)', animation: 'float-orb-a 16s ease-in-out infinite' }}
      />
      <div
        className="absolute top-[18%] right-[-10%] w-[560px] h-[560px] rounded-full blur-[130px]"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.24) 0%, rgba(59,130,246,0) 72%)', animation: 'float-orb-b 18s ease-in-out infinite' }}
      />
      <div
        className="absolute bottom-[-16%] left-[38%] w-[460px] h-[460px] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.20) 0%, rgba(251,146,60,0) 75%)', animation: 'float-orb-c 14s ease-in-out infinite' }}
      />

      {/* Hero center */}
      <div className="relative z-10 container-custom pt-28 md:pt-32 pb-10 flex-1 flex items-center">
        <div className="w-full max-w-6xl mx-auto text-center">
          <div className="hero-kicker inline-flex items-center gap-3 px-4 py-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 mb-8">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">Open For New Projects</span>
          </div>

          <h1 className="hero-title text-5xl sm:text-6xl lg:text-7xl xl:text-[5rem] leading-[0.98] tracking-tight font-black text-text-heading max-w-5xl mx-auto">
            {lead}{' '}
            <AuroraTextEffect text={accent || 'That Scale'} />
          </h1>

          <p className="hero-subtitle mt-7 text-base sm:text-lg lg:text-xl text-text-body/95 max-w-3xl mx-auto leading-relaxed">
            {hero?.subtitle || 'We design and ship conversion-focused digital products that blend premium visuals, resilient architecture, and business-first execution.'}
          </p>

          <div className="hero-ctas mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/contact">
              <Button size="lg">
                {hero?.cta || 'Start Your Project'}
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button variant="secondary" size="lg">Explore Portfolio</Button>
            </Link>
          </div>

          <div className="hero-glass-frame mt-12 md:mt-14 mx-auto max-w-5xl rounded-3xl border border-white/[0.10] bg-white/[0.03] backdrop-blur-xl p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {PILLARS.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/[0.08] bg-black/20 p-5 text-left hover:border-emerald-300/30 transition-colors"
                >
                  <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-200/80 mb-2">Core Value</p>
                  <h3 className="text-lg font-semibold text-text-heading mb-2">{item.title}</h3>
                  <p className="text-sm text-text-body leading-relaxed">{item.subtitle}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-pillars mt-8 flex flex-wrap justify-center gap-2.5">
            {['React', 'Node.js', 'TypeScript', 'Next.js', 'Cloud', 'AI'].map((tag) => (
              <span
                key={tag}
                className="px-3.5 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] text-xs font-medium text-text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div ref={statsRef} className="relative z-10 border-t border-white/[0.08] bg-black/20 backdrop-blur-sm">
        <div className="container-custom py-7">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat: any) => (
              <div key={stat.label} className="flex flex-col items-center md:items-start">
                <span className="text-3xl lg:text-[2.1rem] font-black gradient-text leading-none">{stat.value}</span>
                <span className="text-[11px] uppercase tracking-[0.16em] text-text-muted mt-2">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

