import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useGsapFadeIn } from '@/hooks/useAnimations';
import { fetchServices } from '@/utils/api';
import SectionHeading from '@/components/ui/SectionHeading';
import {
  HiOutlineCodeBracket,
  HiOutlineDevicePhoneMobile,
  HiOutlineCloud,
  HiOutlinePaintBrush,
  HiOutlineCpuChip,
  HiOutlineServerStack,
} from 'react-icons/hi2';

const iconMap: Record<string, any> = {
  web: HiOutlineCodeBracket,
  mobile: HiOutlineDevicePhoneMobile,
  cloud: HiOutlineCloud,
  design: HiOutlinePaintBrush,
  ai: HiOutlineCpuChip,
  backend: HiOutlineServerStack,
};

const gradients = [
  'from-violet-500/20 to-purple-600/10',
  'from-blue-500/20 to-cyan-600/10',
  'from-indigo-500/20 to-blue-600/10',
  'from-fuchsia-500/20 to-pink-600/10',
  'from-emerald-500/20 to-teal-600/10',
  'from-amber-500/20 to-orange-600/10',
];

export default function ServicesSection() {
  const ref = useGsapFadeIn({ stagger: 0.1 });

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
  });

  const displayServices = services || [];

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-glow-violet opacity-20" />

      <div className="container-custom relative z-10">
        <SectionHeading
          label="Services"
          title="What We Do Best"
          subtitle="End-to-end digital solutions tailored to transform your business goals into reality."
          auroraFrom={2}
        />

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayServices.map((service: any, i: number) => {
            const Icon = iconMap[service.icon] || HiOutlineCodeBracket;
            return (
              <Link
                key={service._id}
                to={`/services`}
                className="group glass-card rounded-2xl p-8 relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradients[i % gradients.length]} rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-violet/15 to-accent-blue/10 flex items-center justify-center mb-6 group-hover:from-accent-violet/25 group-hover:to-accent-blue/15 transition-all duration-300">
                    <Icon className="w-7 h-7 text-accent-violet" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-heading mb-3 group-hover:gradient-text transition-all">
                    {service.title}
                  </h3>
                  <p className="text-text-body text-sm leading-relaxed">{service.shortDescription}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {displayServices.length > 0 && (
          <div className="text-center mt-14">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-accent-violet hover:text-accent-blue transition-colors font-medium text-sm group"
            >
              Explore all services
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
