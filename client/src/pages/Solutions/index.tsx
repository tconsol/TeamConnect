import { Helmet } from 'react-helmet-async';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsapFadeIn } from '@/hooks/useAnimations';
import SectionHeading from '@/components/ui/SectionHeading';
import CTASection from '@/sections/home/CTASection';

gsap.registerPlugin(ScrollTrigger);

const solutions = [
  {
    title: 'Enterprise Software',
    description: 'Custom enterprise solutions that streamline operations, improve efficiency, and scale with your business.',
    features: ['ERP Systems', 'CRM Platforms', 'Workflow Automation', 'Business Intelligence'],
    color: 'from-violet-600/20 to-indigo-600/20',
  },
  {
    title: 'E-Commerce Platforms',
    description: 'End-to-end e-commerce solutions with seamless payments, inventory management, and customer analytics.',
    features: ['Custom Storefronts', 'Payment Integration', 'Inventory Management', 'Analytics Dashboard'],
    color: 'from-blue-600/20 to-cyan-600/20',
  },
  {
    title: 'HealthTech Solutions',
    description: 'HIPAA-compliant healthcare applications for telemedicine, patient management, and clinical operations.',
    features: ['Telemedicine', 'EHR Integration', 'Patient Portals', 'Compliance'],
    color: 'from-emerald-600/20 to-teal-600/20',
  },
  {
    title: 'FinTech Applications',
    description: 'Secure financial technology solutions for payments, lending, insurance, and regulatory compliance.',
    features: ['Payment Processing', 'KYC/AML', 'Trading Platforms', 'Blockchain'],
    color: 'from-amber-600/20 to-orange-600/20',
  },
  {
    title: 'EdTech Platforms',
    description: 'Interactive learning platforms with video conferencing, assessment tools, and gamified experiences.',
    features: ['LMS', 'Video Streaming', 'Assessments', 'Gamification'],
    color: 'from-pink-600/20 to-rose-600/20',
  },
  {
    title: 'IoT & Smart Systems',
    description: 'Connected device ecosystems with real-time monitoring, data analytics, and automation.',
    features: ['Device Management', 'Real-time Data', 'Edge Computing', 'Automation'],
    color: 'from-indigo-600/20 to-purple-600/20',
  },
];

export default function Solutions() {
  const cardsRef = useRef<HTMLDivElement>(null);
  const heroRef = useGsapFadeIn();

  useEffect(() => {
    if (!cardsRef.current) return;

    const cards = cardsRef.current.children;
    
    gsap.fromTo(
      cards,
      { x: 100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  return (
    <>
      <Helmet>
        <title>Solutions — TCON Solutions</title>
        <meta name="description" content="Industry-specific solutions for enterprise, e-commerce, healthcare, fintech, and more." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-glow-indigo opacity-20" />
        <div ref={heroRef} className="container-custom relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-semibold uppercase tracking-[0.2em] text-accent-indigo mb-6">
            Solutions
          </span>
          <h1 className="text-hero font-bold text-text-heading leading-tight mb-6">
            Industry-Tailored{' '}
            <span className="gradient-text">Solutions</span>
          </h1>
          <p className="text-subtitle text-text-body max-w-2xl mx-auto leading-relaxed">
            Specialized digital solutions designed for the unique challenges and opportunities in your industry.
          </p>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-32">
        <div className="container-custom">
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {solutions.map((solution) => (
              <div
                key={solution.title}
                className="group glass rounded-2xl overflow-hidden hover:bg-white/[0.08] transition-all duration-500 glow-hover"
              >
                <div className={`h-2 bg-gradient-to-r ${solution.color}`} />
                <div className="p-10">
                  <h3 className="text-2xl font-bold text-text-heading mb-4 group-hover:gradient-text transition-all">
                    {solution.title}
                  </h3>
                  <p className="text-text-body leading-relaxed mb-6">{solution.description}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {solution.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-text-sub">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-indigo" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 bg-bg-secondary">
        <div className="container-custom">
          <SectionHeading
            label="Why TCON"
            title="Why Choose Us"
            subtitle="We combine deep industry knowledge with cutting-edge technology to deliver solutions that truly make a difference."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Domain Expertise', desc: 'Deep understanding of industry-specific challenges and regulations.', val: '10+', label: 'Industries Served' },
              { title: 'Scalable Architecture', desc: 'Solutions built to grow with your business from MVP to enterprise.', val: '99.9%', label: 'Uptime SLA' },
              { title: 'Compliance First', desc: 'Security and compliance baked into every solution from day one.', val: '100%', label: 'Compliance Rate' },
            ].map((item) => (
              <div key={item.title} className="glass rounded-2xl p-8 text-center hover:bg-white/[0.08] transition-all duration-500">
                <div className="text-4xl font-bold gradient-text mb-2">{item.val}</div>
                <div className="text-xs text-text-muted uppercase tracking-wider mb-6">{item.label}</div>
                <h3 className="text-lg font-semibold text-text-heading mb-2">{item.title}</h3>
                <p className="text-text-body text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
