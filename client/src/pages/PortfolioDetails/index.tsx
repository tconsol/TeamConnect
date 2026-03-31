import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchPortfolioBySlug } from '@/utils/api';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { useGsapFadeIn } from '@/hooks/useAnimations';
import { HiArrowLeft } from 'react-icons/hi2';

export default function PortfolioDetails() {
  const { slug } = useParams<{ slug: string }>();
  const ref = useGsapFadeIn();

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['portfolio', slug],
    queryFn: () => fetchPortfolioBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) return <PageSkeleton />;

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-heading mb-4">Project Not Found</h2>
          <p className="text-text-body mb-8">The project you're looking for doesn't exist or has been removed.</p>
          <Link to="/portfolio" className="text-accent-indigo hover:text-accent-blue transition-colors">
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{project.title} — TCON Solutions</title>
        <meta name="description" content={project.shortDescription} />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-16">
        <div className="absolute inset-0 bg-glow-indigo opacity-20" />
        <div ref={ref} className="container-custom relative z-10">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-8"
          >
            <HiArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-xs font-semibold text-accent-indigo uppercase tracking-wider">
                {project.category}
              </span>
              <h1 className="text-display font-bold text-text-heading mt-2 mb-4">{project.title}</h1>
              {project.client && (
                <p className="text-text-sub mb-2">
                  <span className="text-text-muted">Client:</span> {project.client}
                </p>
              )}
              <p className="text-text-body leading-relaxed mb-6">{project.description || project.shortDescription}</p>

              {project.technologies?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech: string) => (
                    <span key={tech} className="px-3 py-1 rounded-full text-xs glass text-text-sub">
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-indigo to-accent-blue text-white font-semibold hover:shadow-lg hover:shadow-accent-indigo/25 transition-all"
                >
                  Visit Live Site →
                </a>
              )}
            </div>

            <div className="glass rounded-2xl overflow-hidden bg-gradient-to-br from-accent-indigo/20 to-accent-blue/10">
              {project.thumbnail ? (
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover aspect-video"
                />
              ) : (
                <div className="aspect-video flex items-center justify-center text-text-muted">
                  <span>No image available</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="py-20 bg-bg-secondary">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {project.challenges && (
              <div className="glass rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-text-heading mb-4">Challenge</h3>
                <p className="text-text-body text-sm leading-relaxed">{project.challenges}</p>
              </div>
            )}
            {project.solution && (
              <div className="glass rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-text-heading mb-4">Solution</h3>
                <p className="text-text-body text-sm leading-relaxed">{project.solution}</p>
              </div>
            )}
            {project.results && (
              <div className="glass rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-text-heading mb-4">Results</h3>
                <p className="text-text-body text-sm leading-relaxed">{project.results}</p>
              </div>
            )}
          </div>

          {project.testimonial?.quote && (
            <div className="mt-16 glass rounded-2xl p-10 text-center max-w-3xl mx-auto">
              <p className="text-xl text-text-sub italic leading-relaxed mb-4">
                "{project.testimonial.quote}"
              </p>
              <p className="text-text-heading font-semibold">{project.testimonial.author}</p>
              <p className="text-text-muted text-sm">{project.testimonial.role}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
