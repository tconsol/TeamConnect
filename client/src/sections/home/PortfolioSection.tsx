import { Link } from 'react-router-dom';
import { useGsapFadeIn } from '@/hooks/useAnimations';
import SectionHeading from '@/components/ui/SectionHeading';

const projects = [
  {
    title: 'FinTech Dashboard',
    category: 'Web App',
    image: '',
    slug: 'fintech-dashboard',
  },
  {
    title: 'Health & Wellness Platform',
    category: 'Mobile + Web',
    image: '',
    slug: 'health-platform',
  },
  {
    title: 'E-Commerce Ecosystem',
    category: 'Full Stack',
    image: '',
    slug: 'ecommerce-ecosystem',
  },
];

export default function PortfolioSection() {
  const ref = useGsapFadeIn({ stagger: 0.15 });

  return (
    <section className="relative py-32">
      <div className="container-custom">
        <SectionHeading
          label="Portfolio"
          title="Featured Work"
          subtitle="A showcase of our best projects that demonstrate our expertise and creative vision."
        />

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <Link
              key={project.slug}
              to={`/portfolio/${project.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] glass"
            >
              {/* Placeholder gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${
                  i === 0
                    ? 'from-accent-indigo/20 to-purple-900/20'
                    : i === 1
                    ? 'from-accent-blue/20 to-cyan-900/20'
                    : 'from-indigo-900/20 to-accent-indigo/20'
                } group-hover:scale-110 transition-transform duration-700`}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="text-xs font-semibold text-accent-indigo uppercase tracking-wider">
                  {project.category}
                </span>
                <h3 className="text-2xl font-bold text-white mt-2 group-hover:gradient-text transition-all">
                  {project.title}
                </h3>
                <div className="mt-4 flex items-center gap-2 text-sm text-text-body group-hover:text-white transition-colors">
                  View Project
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-accent-indigo hover:text-accent-blue transition-colors font-medium"
          >
            View all projects
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
