import { Helmet } from 'react-helmet-async';
import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { useGsapFadeIn } from '@/hooks/useAnimations';
import { cmsQueryOptions } from '@/utils/cmsQueryOptions';
import SectionHeading from '@/components/ui/SectionHeading';
import { AuroraTextEffect } from '@/components/ui/AuroraTextEffect';
import CTASection from '@/sections/home/CTASection';
import { getCanonicalUrl, breadcrumbJsonLd } from '@/utils/seo';
import {
  HiOutlineShieldCheck,
  HiOutlineArrowTrendingUp,
  HiOutlineServerStack,
  HiOutlineCpuChip,
  HiOutlineGlobeAlt,
  HiOutlineBolt,
} from 'react-icons/hi2';

gsap.registerPlugin(ScrollTrigger);

const solutionIcons = [
  HiOutlineCpuChip,
  HiOutlineGlobeAlt,
  HiOutlineServerStack,
  HiOutlineBolt,
  HiOutlineShieldCheck,
  HiOutlineArrowTrendingUp,
];

const accentColors = [
  { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)', text: '#a78bfa', glow: 'rgba(139,92,246,0.08)' },
  { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)', text: '#60a5fa', glow: 'rgba(59,130,246,0.08)' },
  { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', text: '#34d399', glow: 'rgba(16,185,129,0.08)' },
  { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', text: '#fbbf24', glow: 'rgba(245,158,11,0.08)' },
  { bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.25)', text: '#f472b6', glow: 'rgba(236,72,153,0.08)' },
  { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.25)', text: '#818cf8', glow: 'rgba(99,102,241,0.08)' },
];

export default function Solutions() {
  const location = useLocation();
  const canonicalUrl = getCanonicalUrl(location.pathname);
  
  const cardsRef = useRef<HTMLDivElement>(null);
  const heroRef = useGsapFadeIn();

  const breadcrumbs = [
    { name: 'Home', url: 'https://tconsolutions.com' },
    { name: 'Solutions', url: canonicalUrl },
  ];

  const { data: cms } = useQuery(cmsQueryOptions('solutions'));

  const content = cms?.content;
  const solutions = content?.items || [];

  useEffect(() => {
    if (!cardsRef.current || solutions.length === 0) return;

    const cards = cardsRef.current.children;

    const tween = gsap.fromTo(
      cards,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 85%',
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [solutions]);

  return (
    <>
      <Helmet>
        <title>Solutions TCON Solutions</title>
        <meta name="description" content="Industry-specific solutions for healthcare, fintech, e-commerce, education, and more. Customized digital solutions for your business." />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Solutions TCON Solutions" />
        <meta property="og:description" content="Industry-specific digital solutions tailored to your business needs." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://tconsolutions.com/og-solutions.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Solutions TCON Solutions" />
        <meta name="twitter:description" content="Customized digital solutions for your industry." />
        
        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd(breadcrumbs))}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-glow-violet opacity-20" />
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-accent-violet/[0.06] rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent-blue/[0.06] rounded-full blur-[150px] pointer-events-none" />
        <div ref={heroRef} className="container-custom relative z-10 text-center">
          <span className="tag mb-6">Solutions</span>
          <h1 className="text-hero font-extrabold text-text-heading leading-tight mb-6">
            Industry-Tailored{' '}
            <AuroraTextEffect text="Solutions" />
          </h1>
          <p className="text-subtitle text-text-body max-w-2xl mx-auto leading-relaxed">
            {content?.description || 'Specialized digital solutions designed for the unique challenges and opportunities in your industry.'}
          </p>
        </div>
      </section>

      {/* Solutions Bento-style staggered grid */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(139,92,246,0.08),transparent_50%),radial-gradient(circle_at_80%_50%,rgba(59,130,246,0.06),transparent_50%)]" />
        <div className="container-custom relative z-10">
          <SectionHeading
            label="Industries"
            title="Built for Your Domain"
            subtitle="Every solution is precision-engineered for the specific demands of your industry."
            auroraFrom={2}
          />

          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {solutions.map((solution: any, i: number) => {
              const Icon = solutionIcons[i % solutionIcons.length];
              const accent = accentColors[i % accentColors.length];
              const isLarge = i % 5 === 0;

              return (
                <div
                  key={solution._id || solution.title}
                  className={`group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 ${
                    isLarge ? 'md:col-span-2 lg:col-span-2' : ''
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${accent.glow} 0%, transparent 60%)` }}
                  />

                  {/* Top accent bar */}
                  <div className="h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${accent.text}, transparent)`, opacity: 0.5 }} />

                  <div className={`relative z-10 ${isLarge ? 'p-8 md:p-10' : 'p-7'}`}>
                    <div className="flex items-start gap-4 mb-5">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                        style={{ background: accent.bg, border: `1px solid ${accent.border}` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: accent.text }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-text-heading leading-snug group-hover:text-white transition-colors">
                          {solution.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-text-body text-sm leading-relaxed mb-6">{solution.description}</p>

                    {solution.features?.length > 0 && (
                      <div className={`grid ${isLarge ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'} gap-2.5`}>
                        {solution.features.map((feature: string, fi: number) => (
                          <motion.div
                            key={feature}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.05 * fi, duration: 0.4 }}
                            className="flex items-center gap-2.5 text-sm"
                          >
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent.text }} />
                            <span className="text-text-sub">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Modern stat cards */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-bg-secondary" />
        <div className="absolute inset-0 line-grid opacity-20" />
        <div className="container-custom relative z-10">
          <SectionHeading
            label="Why TCON"
            title="Why Choose Us"
            subtitle="We combine deep industry knowledge with cutting-edge technology to deliver solutions that truly make a difference."
            auroraFrom={2}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Domain Expertise', desc: 'Deep understanding of industry-specific challenges and regulations.', val: '10+', label: 'Industries Served', color: '#a78bfa' },
              { title: 'Scalable Architecture', desc: 'Solutions built to grow with your business from MVP to enterprise.', val: '99.9%', label: 'Uptime SLA', color: '#60a5fa' },
              { title: 'Compliance First', desc: 'Security and compliance baked into every solution from day one.', val: '100%', label: 'Compliance Rate', color: '#34d399' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.6 }}
                className="group relative rounded-2xl p-8 text-center overflow-hidden transition-all duration-500 hover:-translate-y-1"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at 50% 0%, ${item.color}15 0%, transparent 60%)` }} />
                <div className="relative z-10">
                  <div className="text-5xl font-extrabold mb-2" style={{ color: item.color }}>{item.val}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] mb-6" style={{ color: `${item.color}99` }}>{item.label}</div>
                  <h3 className="text-lg font-semibold text-text-heading mb-2">{item.title}</h3>
                  <p className="text-text-body text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
