import { useGsapFadeIn } from '@/hooks/useAnimations';

const stats = [
  { value: '150+', label: 'Projects Delivered' },
  { value: '50+', label: 'Happy Clients' },
  { value: '5+', label: 'Years Experience' },
  { value: '99%', label: 'Client Satisfaction' },
];

export default function StatsSection() {
  const ref = useGsapFadeIn({ stagger: 0.1 });

  return (
    <section className="relative py-20 border-y border-white/[0.06]">
      <div ref={ref} className="container-custom grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.value}</div>
            <div className="text-sm text-text-muted uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
