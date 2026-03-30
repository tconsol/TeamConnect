import { Helmet } from 'react-helmet-async';
import { useGsapFadeIn } from '@/hooks/useAnimations';
import SectionHeading from '@/components/ui/SectionHeading';
import CTASection from '@/sections/home/CTASection';
import {
  HiOutlineCodeBracket,
  HiOutlineDevicePhoneMobile,
  HiOutlineCloud,
  HiOutlinePaintBrush,
  HiOutlineCpuChip,
  HiOutlineShieldCheck,
  HiOutlineCircleStack,
  HiOutlineRocketLaunch,
} from 'react-icons/hi2';

const services = [
  {
    icon: HiOutlineCodeBracket,
    title: 'Web Development',
    description: 'Custom web applications built with React, Next.js, and Node.js. From simple landing pages to complex SaaS platforms.',
    features: ['React / Next.js', 'Node.js / Express', 'Database Design', 'API Development'],
  },
  {
    icon: HiOutlineDevicePhoneMobile,
    title: 'Mobile Development',
    description: 'Native and cross-platform mobile apps for iOS and Android using React Native and Flutter.',
    features: ['React Native', 'Flutter', 'iOS & Android', 'Push Notifications'],
  },
  {
    icon: HiOutlineCloud,
    title: 'Cloud & DevOps',
    description: 'Cloud infrastructure setup, CI/CD pipelines, and scalable deployment solutions on AWS, GCP, and Azure.',
    features: ['AWS / GCP / Azure', 'Docker & K8s', 'CI/CD Pipelines', 'Monitoring'],
  },
  {
    icon: HiOutlinePaintBrush,
    title: 'UI/UX Design',
    description: 'User-centered design that combines stunning aesthetics with intuitive functionality.',
    features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
  },
  {
    icon: HiOutlineCpuChip,
    title: 'AI & Machine Learning',
    description: 'Intelligent solutions powered by machine learning, NLP, and computer vision.',
    features: ['ML Models', 'NLP', 'Computer Vision', 'Data Analytics'],
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Cybersecurity',
    description: 'Comprehensive security solutions including audits, penetration testing, and compliance.',
    features: ['Security Audits', 'Pen Testing', 'Compliance', 'Incident Response'],
  },
  {
    icon: HiOutlineCircleStack,
    title: 'Data Engineering',
    description: 'End-to-end data pipelines, warehousing, and analytics solutions for data-driven decisions.',
    features: ['ETL Pipelines', 'Data Warehousing', 'BI Dashboards', 'Big Data'],
  },
  {
    icon: HiOutlineRocketLaunch,
    title: 'Digital Strategy',
    description: 'Strategic consulting to align technology with business goals and drive digital transformation.',
    features: ['Tech Strategy', 'Digital Transformation', 'Process Automation', 'Growth Hacking'],
  },
];

const process = [
  { step: '01', title: 'Discovery', description: 'Deep dive into your business goals, target audience, and technical requirements.' },
  { step: '02', title: 'Strategy & Planning', description: 'Create a detailed roadmap with milestones, timelines, and tech stack decisions.' },
  { step: '03', title: 'Design', description: 'Craft pixel-perfect designs that align with your brand and delight users.' },
  { step: '04', title: 'Development', description: 'Build with clean, scalable, and well-tested code using modern frameworks.' },
  { step: '05', title: 'Testing & QA', description: 'Rigorous testing across devices, browsers, and use cases for a flawless experience.' },
  { step: '06', title: 'Launch & Support', description: 'Deploy with confidence and provide ongoing optimization and maintenance.' },
];

export default function Services() {
  const servicesRef = useGsapFadeIn({ stagger: 0.08 });
  const processRef = useGsapFadeIn({ stagger: 0.1 });

  return (
    <>
      <Helmet>
        <title>Services — TCON Solutions</title>
        <meta name="description" content="End-to-end digital solutions: web development, mobile apps, cloud, AI, cybersecurity, and more." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-glow-indigo opacity-20" />
        <div className="container-custom relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-semibold uppercase tracking-[0.2em] text-accent-indigo mb-6">
            Our Services
          </span>
          <h1 className="text-hero font-bold text-text-heading leading-tight mb-6">
            Solutions That Drive{' '}
            <span className="gradient-text">Growth</span>
          </h1>
          <p className="text-subtitle text-text-body max-w-2xl mx-auto leading-relaxed">
            From concept to deployment, we deliver end-to-end digital solutions tailored to your unique business needs.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-32">
        <div className="container-custom">
          <div ref={servicesRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="group glass rounded-2xl p-8 hover:bg-white/[0.08] transition-all duration-500 glow-hover"
              >
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 shrink-0 rounded-xl bg-accent-indigo/10 flex items-center justify-center group-hover:bg-accent-indigo/20 transition-colors">
                    <service.icon className="w-7 h-7 text-accent-indigo" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-text-heading mb-3">{service.title}</h3>
                    <p className="text-text-body text-sm leading-relaxed mb-4">{service.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((f) => (
                        <span key={f} className="px-3 py-1 rounded-full text-xs bg-white/[0.06] text-text-sub">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-32 bg-bg-secondary">
        <div className="container-custom">
          <SectionHeading
            label="Our Process"
            title="How We Deliver Results"
            subtitle="A battle-tested process refined over hundreds of successful projects."
          />
          <div ref={processRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {process.map((step) => (
              <div key={step.step} className="glass rounded-2xl p-8 hover:bg-white/[0.08] transition-all duration-500">
                <span className="text-3xl font-bold gradient-text">{step.step}</span>
                <h3 className="text-lg font-semibold text-text-heading mt-3 mb-2">{step.title}</h3>
                <p className="text-text-body text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
