import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useGsapFadeIn } from '@/hooks/useAnimations';
import { fetchPortfolios } from '@/utils/api';
import SectionHeading from '@/components/ui/SectionHeading';

const gradients = [
  'from-violet-600/30 via-purple-800/20 to-indigo-900/20',
  'from-blue-600/30 via-cyan-800/20 to-sky-900/20',
  'from-indigo-600/30 via-blue-800/20 to-violet-900/20',
];

export default function PortfolioSection() {
  const ref = useGsapFadeIn({ stagger: 0.15 });

  const { data: portfolios } = useQuery({
    queryKey: ['portfolios', 'featured'],
    queryFn: () => fetchPortfolios({ featured: 'true' }),
  });

  const projects = (portfolios || []).slice(0, 3);

  return (
    <section className="relative py-32">
      <div className="container-custom">
        <SectionHeading
          label="Portfolio"
          title="Featured Work"
          subtitle="A showcase of our best projects that demonstrate our expertise and creative vision."
          auroraFrom={1}
        />

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project: any, i: number) => (
            <Link
              key={project._id}
              to={`/portfolio/${project.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] glass-card"
            >
              {project.thumbnail ? (
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${gradients[i % gradients.length]} group-hover:scale-110 transition-transform duration-700`}
                />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="tag mb-3">
                  {project.category}
                </span>
                <h3 className="text-2xl font-bold text-white mt-2 group-hover:gradient-text transition-all">
                  {project.title}
                </h3>
                <p className="text-text-muted text-sm mt-2 line-clamp-2">{project.shortDescription}</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-text-body group-hover:text-accent-violet transition-colors">
                  View Project
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {projects.length > 0 && (
          <div className="text-center mt-14">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 text-accent-violet hover:text-accent-blue transition-colors font-medium text-sm group"
            >
              View all projects
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
