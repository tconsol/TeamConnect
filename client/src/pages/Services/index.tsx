import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { useGsapFadeIn } from '@/hooks/useAnimations';
import { fetchServices } from '@/utils/api';
import { cmsQueryOptions } from '@/utils/cmsQueryOptions';
import SectionHeading from '@/components/ui/SectionHeading';
import { AuroraTextEffect } from '@/components/ui/AuroraTextEffect';
import CTASection from '@/sections/home/CTASection';
import ScrollStack from '@/components/ui/ScrollStack';
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

export default function Services() {
  const servicesRef = useGsapFadeIn({ stagger: 0.08 });
  const processRef = useGsapFadeIn({ stagger: 0.1 });

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
  });

  const { data: cms } = useQuery(cmsQueryOptions('services'));

  const cmsContent = cms?.content;
  const processSteps = cmsContent?.process || [];

  return (
    <>
      <Helmet>
        <title>Services — TCON Solutions</title>
        <meta name="description" content="End-to-end digital solutions: web development, mobile apps, cloud, AI, and more." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-glow-violet opacity-20" />
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="container-custom relative z-10 text-center">
          <span className="tag mb-6">Our Services</span>
          <h1 className="text-hero font-extrabold text-text-heading leading-tight mb-6">
            Solutions That Drive{' '}
            <AuroraTextEffect text="Growth" />
          </h1>
          <p className="text-subtitle text-text-body max-w-2xl mx-auto leading-relaxed">
            {cmsContent?.description || 'From concept to deployment, we deliver end-to-end digital solutions tailored to your unique business needs.'}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-32">
        <div className="container-custom">
          <div ref={servicesRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(services || []).map((service: any) => {
              const Icon = iconMap[service.icon] || HiOutlineCodeBracket;
              return (
                <div
                  key={service._id}
                  className="group glass-card rounded-2xl p-8"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-accent-violet/15 to-accent-blue/10 flex items-center justify-center group-hover:from-accent-violet/25 group-hover:to-accent-blue/15 transition-all duration-300">
                      <Icon className="w-7 h-7 text-accent-violet" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-text-heading mb-3 group-hover:gradient-text transition-all">{service.title}</h3>
                      <p className="text-text-body text-sm leading-relaxed mb-4">{service.shortDescription}</p>
                      {service.features?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {service.features.map((f: any) => (
                            <span key={f.title} className="tag">
                              {f.title}
                            </span>
                          ))}
                        </div>
                      )}
                      {service.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {service.technologies.map((t: string) => (
                            <span key={t} className="px-2.5 py-0.5 rounded-md text-xs bg-white/[0.04] text-text-muted border border-white/[0.06]">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process — ScrollStack */}
      {processSteps.length > 0 && (
        <section className="relative">
          <div className="absolute inset-0 bg-bg-secondary" style={{ zIndex: -1 }} />
          <div className="container-custom relative z-10 pt-24">
            <SectionHeading
              label="Our Process"
              title="How We Deliver Results"
              subtitle="A battle-tested process refined over hundreds of successful projects."
              auroraFrom={2}
            />
          </div>
          <ScrollStack
            backgroundColor="#080010"
            cardHeight="55vh"
            cardMaxHeight="520px"
            sectionHeightMultiplier={processSteps.length + 1}
            cards={processSteps.map((step: any, i: number) => ({
              badge: `Step ${i + 1}`,
              title: step.title,
              subtitle: step.description,
            }))}
          />
        </section>
      )}

      <CTASection />
    </>
  );
}
