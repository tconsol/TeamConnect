import { useQuery } from '@tanstack/react-query';
import {
  ThreeDScrollTriggerContainer,
  ThreeDScrollTriggerRow,
} from '@/components/ui/ThreeDScrollTrigger';
import { fetchTestimonials } from '@/utils/api';
import { AuroraTextEffect } from '@/components/ui/AuroraTextEffect';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const STATIC_TESTIMONIALS = [
  {
    quote:
      'TCON Solutions delivered a platform that transformed how we deliver healthcare. The quality and attention to detail exceeded all expectations.',
    author: 'Dr. Sarah Mitchell',
    role: 'CEO, MedCare Inc.',
    avatar: 'S',
    color: 'from-violet-500 to-purple-600',
  },
  {
    quote:
      'The dashboard has become the nerve center of our operations. Their engineering team is world-class — responsive, skilled, and truly invested.',
    author: 'Michael Chen',
    role: 'CTO, Global Finance Corp',
    avatar: 'M',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    quote:
      'Our online sales tripled within the first quarter of launch. The platform is blazing fast and our customers absolutely love it.',
    author: 'Jessica Park',
    role: 'VP Digital, Retail Dynamics',
    avatar: 'J',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    quote:
      'Lightswind-quality components, enterprise-grade architecture. We built our entire SaaS product in record time thanks to their expertise.',
    author: 'Priya Sharma',
    role: 'Founder, NextGenSaaS',
    avatar: 'P',
    color: 'from-amber-500 to-orange-500',
  },
  {
    quote:
      'From concept to launch in 6 weeks. Their agile methodology and communication were impeccable every step of the way.',
    author: "Liam O'Brien",
    role: 'CTO, TransGlobal Logistics',
    avatar: 'L',
    color: 'from-rose-500 to-pink-600',
  },
  {
    quote:
      'Exceptional technical depth paired with beautiful design. Every component they built felt premium and production-ready.',
    author: 'Zoe Williams',
    role: 'Head of Product, Studio Aurora',
    avatar: 'Z',
    color: 'from-indigo-500 to-violet-600',
  },
];

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  color: string;
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div
      className="flex-shrink-0 w-80 p-6 rounded-2xl border border-white/[0.08] relative overflow-hidden group transition-all duration-300 hover:border-accent-violet/25"
      style={{
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
      }}
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'radial-gradient(circle at top left, rgba(139,92,246,0.07) 0%, transparent 70%)' }} 
      />

      {/* Quote mark */}
      <div className="mb-4 text-4xl font-serif leading-none text-accent-violet/40 select-none">"</div>

      <p className="text-sm text-text-body leading-relaxed mb-6 relative z-10">
        {testimonial.quote}
      </p>

      <div className="flex items-center gap-3 relative z-10">
        <div
          className={`w-9 h-9 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}
        >
          {testimonial.avatar}
        </div>
        <div>
          <p className="text-sm font-semibold text-text-heading">{testimonial.author}</p>
          <p className="text-xs text-text-muted">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const { data: testimonialData, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => fetchTestimonials(),
  });

  const testimonials: Testimonial[] = (testimonialData || [])
    .filter((t: any) => t.isActive)
    .map((t: any) => ({
      quote: t.quote,
      author: t.author,
      role: t.role,
      avatar: t.avatar,
      color: t.color,
    })) || STATIC_TESTIMONIALS;

  const row1 = testimonials;
  const row2 = [...testimonials].reverse();

  return (
    <section className="relative py-16 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-bg-secondary" />
      <div className="absolute inset-0 dot-pattern opacity-30" />

      <div className="relative z-10">
        {/* Heading */}
        <div className="container-custom text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-semibold uppercase tracking-[0.2em] text-accent-indigo mb-4">
            Testimonials
          </span>
          <h2 className="text-display font-bold text-text-heading leading-tight mb-4">
            Trusted by{' '}
            <AuroraTextEffect text="Industry Leaders" className="inline" />
          </h2>
          <ScrollReveal
            size="md"
            align="center"
            variant="muted"
            containerClassName="max-w-xl mx-auto"
            staggerDelay={0.04}
          >
            Don't take our word for it. Hear directly from the clients we've helped transform
            their businesses with technology.
          </ScrollReveal>
        </div>

        {/* Row 1 — scrolling right */}
        <ThreeDScrollTriggerContainer className="mb-6">
          <ThreeDScrollTriggerRow baseVelocity={3} direction={1} className="gap-5 py-2">
            {row1.map((t, i) => (
              <TestimonialCard key={i} testimonial={t} />
            ))}
          </ThreeDScrollTriggerRow>
        </ThreeDScrollTriggerContainer>

        {/* Row 2 — scrolling left */}
        <ThreeDScrollTriggerContainer>
          <ThreeDScrollTriggerRow baseVelocity={2.5} direction={-1} className="gap-5 py-2">
            {row2.map((t, i) => (
              <TestimonialCard key={i} testimonial={t} />
            ))}
          </ThreeDScrollTriggerRow>
        </ThreeDScrollTriggerContainer>
      </div>
    </section>
  );
}
