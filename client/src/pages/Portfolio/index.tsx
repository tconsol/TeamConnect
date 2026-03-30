import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchPortfolios } from '@/utils/api';
import { useGsapFadeIn } from '@/hooks/useAnimations';
import { PageSkeleton } from '@/components/ui/Skeleton';

const categories = ['All', 'Web App', 'Mobile', 'Full Stack', 'E-Commerce', 'SaaS'];

const fallbackProjects = [
  { _id: '1', title: 'FinTech Dashboard', slug: 'fintech-dashboard', category: 'Web App', shortDescription: 'Real-time financial analytics and reporting dashboard for institutional investors.', technologies: ['React', 'Node.js', 'PostgreSQL'], thumbnail: '' },
  { _id: '2', title: 'Health & Wellness Platform', slug: 'health-platform', category: 'Mobile', shortDescription: 'Comprehensive telemedicine platform connecting patients with healthcare providers.', technologies: ['React Native', 'Firebase', 'AI'], thumbnail: '' },
  { _id: '3', title: 'E-Commerce Ecosystem', slug: 'ecommerce-ecosystem', category: 'Full Stack', shortDescription: 'Multi-vendor marketplace with AI-powered recommendations and real-time inventory.', technologies: ['Next.js', 'Stripe', 'MongoDB'], thumbnail: '' },
  { _id: '4', title: 'SaaS Analytics', slug: 'saas-analytics', category: 'SaaS', shortDescription: 'Business intelligence platform with custom dashboards and automated reporting.', technologies: ['Vue.js', 'Python', 'AWS'], thumbnail: '' },
  { _id: '5', title: 'Smart Retail POS', slug: 'smart-retail', category: 'Full Stack', shortDescription: 'Cloud-based point-of-sale system with inventory and customer management.', technologies: ['React', 'Node.js', 'Redis'], thumbnail: '' },
  { _id: '6', title: 'EdTech Platform', slug: 'edtech-platform', category: 'Web App', shortDescription: 'Interactive learning management system with video conferencing and assessments.', technologies: ['React', 'WebRTC', 'PostgreSQL'], thumbnail: '' },
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All');
  const ref = useGsapFadeIn({ stagger: 0.1 });

  const { data: projects, isLoading } = useQuery({
    queryKey: ['portfolios'],
    queryFn: () => fetchPortfolios(),
    placeholderData: fallbackProjects,
  });

  const filtered = activeCategory === 'All'
    ? (projects || fallbackProjects)
    : (projects || fallbackProjects).filter((p: any) => p.category === activeCategory);

  if (isLoading) return <PageSkeleton />;

  return (
    <>
      <Helmet>
        <title>Portfolio — TCON Solutions</title>
        <meta name="description" content="Explore our portfolio of premium digital products and successful client projects." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-glow-indigo opacity-20" />
        <div className="container-custom relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-semibold uppercase tracking-[0.2em] text-accent-indigo mb-6">
            Portfolio
          </span>
          <h1 className="text-hero font-bold text-text-heading leading-tight mb-6">
            Our <span className="gradient-text">Work</span>
          </h1>
          <p className="text-subtitle text-text-body max-w-2xl mx-auto leading-relaxed">
            A curated collection of projects that showcase our expertise, creativity, and commitment to excellence.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-white/[0.06]">
        <div className="container-custom">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-accent-indigo to-accent-blue text-white'
                    : 'glass text-text-body hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20">
        <div className="container-custom">
          <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project: any, i: number) => (
              <Link
                key={project._id || i}
                to={`/portfolio/${project.slug}`}
                className="group glass rounded-2xl overflow-hidden hover:bg-white/[0.08] transition-all duration-500 glow-hover"
              >
                <div className={`aspect-video bg-gradient-to-br ${
                  ['from-accent-indigo/20 to-purple-900/20', 'from-accent-blue/20 to-cyan-900/20', 'from-indigo-900/20 to-violet-900/20'][i % 3]
                } group-hover:scale-105 transition-transform duration-700`} />
                <div className="p-6">
                  <span className="text-xs font-semibold text-accent-indigo uppercase tracking-wider">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-semibold text-text-heading mt-2 mb-2 group-hover:gradient-text transition-all">
                    {project.title}
                  </h3>
                  <p className="text-text-body text-sm leading-relaxed line-clamp-2 mb-4">
                    {project.shortDescription}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(project.technologies || []).slice(0, 3).map((tech: string) => (
                      <span key={tech} className="px-2 py-0.5 rounded text-xs bg-white/[0.06] text-text-muted">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-text-muted text-lg">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
