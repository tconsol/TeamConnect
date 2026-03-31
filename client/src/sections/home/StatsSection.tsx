import { useQuery } from '@tanstack/react-query';
import { useGsapFadeIn } from '@/hooks/useAnimations';
import { cmsQueryOptions } from '@/utils/cmsQueryOptions';

export default function StatsSection() {
  const ref = useGsapFadeIn({ stagger: 0.1 });

  const { data: cms } = useQuery(cmsQueryOptions('home'));

  const stats = cms?.content?.stats || [];

  if (stats.length === 0) return null;

  return (
    <section className="relative py-24">
      <div className="section-divider mb-24" />
      <div ref={ref} className="container-custom grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {stats.map((stat: any) => (
          <div key={stat.label} className="text-center group">
            <div className="text-5xl md:text-6xl font-extrabold gradient-text mb-3 tracking-tight">{stat.value}</div>
            <div className="text-xs text-text-muted uppercase tracking-[0.2em] font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="section-divider mt-24" />
    </section>
  );
}
