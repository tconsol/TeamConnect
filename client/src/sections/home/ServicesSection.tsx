import { Link } from 'react-router-dom';
import { useGsapFadeIn } from '@/hooks/useAnimations';
import SectionHeading from '@/components/ui/SectionHeading';
import {
  HiOutlineCodeBracket,
  HiOutlineDevicePhoneMobile,
  HiOutlineCloud,
  HiOutlinePaintBrush,
  HiOutlineCpuChip,
  HiOutlineShieldCheck,
} from 'react-icons/hi2';

const services = [
  {
    icon: HiOutlineCodeBracket,
    title: 'Web Development',
    description: 'Full-stack web applications with modern frameworks and scalable architecture.',
  },
  {
    icon: HiOutlineDevicePhoneMobile,
    title: 'Mobile Apps',
    description: 'Native and cross-platform mobile applications for iOS and Android.',
  },
  {
    icon: HiOutlineCloud,
    title: 'Cloud Solutions',
    description: 'Cloud infrastructure, DevOps, and scalable deployment solutions.',
  },
  {
    icon: HiOutlinePaintBrush,
    title: 'UI/UX Design',
    description: 'User-centered design that combines aesthetics with functionality.',
  },
  {
    icon: HiOutlineCpuChip,
    title: 'AI & ML',
    description: 'Intelligent solutions powered by machine learning and artificial intelligence.',
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Cybersecurity',
    description: 'Comprehensive security audits, penetration testing, and compliance.',
  },
];

export default function ServicesSection() {
  const ref = useGsapFadeIn({ stagger: 0.1 });

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-glow-indigo opacity-20" />
      
      <div className="container-custom relative z-10">
        <SectionHeading
          label="Services"
          title="What We Do Best"
          subtitle="End-to-end digital solutions tailored to transform your business goals into reality."
        />

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group glass rounded-2xl p-8 hover:bg-white/[0.08] transition-all duration-500 cursor-pointer glow-hover"
            >
              <div className="w-14 h-14 rounded-xl bg-accent-indigo/10 flex items-center justify-center mb-6 group-hover:bg-accent-indigo/20 transition-colors">
                <service.icon className="w-7 h-7 text-accent-indigo" />
              </div>
              <h3 className="text-xl font-semibold text-text-heading mb-3 group-hover:gradient-text transition-all">
                {service.title}
              </h3>
              <p className="text-text-body text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-accent-indigo hover:text-accent-blue transition-colors font-medium"
          >
            Explore all services
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
