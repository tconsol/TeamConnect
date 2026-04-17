import { Helmet } from 'react-helmet-async';
import { useLocation, useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchPortfolioBySlug } from '@/utils/api';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { HiArrowLeft, HiArrowTopRightOnSquare } from 'react-icons/hi2';
import { getCanonicalUrl, breadcrumbJsonLd } from '@/utils/seo';

// Converts a value (string or array) to a clean string array
// Handles legacy data with emojis, newlines, and commas
const toArray = (val: unknown): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) {
    return (val as string[]).map((s) => String(s).trim()).filter(Boolean);
  }
  const str = String(val).trim();
  if (!str) return [];
  // Split by newline first (highest priority for legacy data) — trim trailing commas
  const lines = str.split(/[\r\n]+/).map((s) => s.replace(/,\s*$/, '').trim()).filter(Boolean);
  if (lines.length > 1) return lines;
  // Fall back to comma split
  return str.split(',').map((s) => s.trim()).filter(Boolean);
};

export default function PortfolioDetails() {
  const location = useLocation();
  const { slug } = useParams<{ slug: string }>();

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['portfolio', slug],
    queryFn: () => fetchPortfolioBySlug(slug!),
    enabled: !!slug,
    staleTime: 45 * 60 * 1000,
    refetchInterval: 50 * 60 * 1000,
    refetchOnMount: true,
  });

  const canonicalUrl = getCanonicalUrl(location.pathname);
  const breadcrumbs = [
    { name: 'Home', url: 'https://tconsolutions.com' },
    { name: 'Portfolio', url: 'https://tconsolutions.com/portfolio' },
    { name: project?.title || 'Project', url: canonicalUrl },
  ];

  if (isLoading) return <PageSkeleton />;

  if (error || !project) {
    return (
      <>
        <Helmet>
          <title>Project Not Found — TCON Solutions</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-text-heading mb-4">Project Not Found</h2>
            <p className="text-text-body mb-8">The project you're looking for doesn't exist or has been removed.</p>
            <Link to="/portfolio" className="inline-flex items-center gap-2 text-accent-indigo hover:text-accent-blue transition-colors">
              <HiArrowLeft className="w-4 h-4" /> Back to Portfolio
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{project.title} — TCON Solutions</title>
        <meta name="description" content={project.shortDescription} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={project.title} />
        <meta property="og:description" content={project.shortDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={project.thumbnail || 'https://tconsolutions.com/og-portfolio.png'} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={project.title} />
        <meta name="twitter:description" content={project.shortDescription} />
        <meta name="twitter:image" content={project.thumbnail || 'https://tconsolutions.com/og-portfolio.png'} />
        
        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd(breadcrumbs))}</script>
      </Helmet>

      {/* Hero: title + meta */}
      <section className="relative pt-28 pb-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-indigo/10 via-transparent to-transparent pointer-events-none" />
        <div className="container-custom relative z-10">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-8 group"
          >
            <HiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Portfolio
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
            <div className="max-w-3xl">
              {project.category && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-accent-indigo/10 text-accent-indigo border border-accent-indigo/20 mb-4">
                  {project.category}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-heading leading-tight mb-4">
                {project.title}
              </h1>
              <p className="text-base text-text-body max-w-xl leading-relaxed">{project.shortDescription}</p>
            </div>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-accent-indigo to-accent-blue text-white text-sm font-semibold hover:shadow-lg hover:shadow-accent-indigo/30 hover:-translate-y-0.5 transition-all"
              >
                Live Site <HiArrowTopRightOnSquare className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Meta strip */}
          <div className="flex flex-wrap items-center gap-8 border-t border-white/[0.06] pt-5">
            {project.client && (
              <div>
                <span className="block text-[10px] uppercase tracking-widest mb-1 text-text-muted/60">Client</span>
                <span className="text-text-sub font-medium text-sm">{project.client}</span>
              </div>
            )}
            {project.year && (
              <div>
                <span className="block text-[10px] uppercase tracking-widest mb-1 text-text-muted/60">Year</span>
                <span className="text-text-sub font-medium text-sm">{project.year}</span>
              </div>
            )}
            {project.category && (
              <div>
                <span className="block text-[10px] uppercase tracking-widest mb-1 text-text-muted/60">Category</span>
                <span className="text-text-sub font-medium text-sm">{project.category}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Image + Sidebar row */}
      <section className="pb-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Image — takes 2 cols */}
            <div className="lg:col-span-2">
              {project.thumbnail ? (
                <div className="rounded-2xl overflow-hidden w-full shadow-2xl shadow-black/40 max-h-96">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-auto object-cover object-center"
                  />
                </div>
              ) : (
                <div className="rounded-2xl w-full aspect-video bg-gradient-to-br from-accent-indigo/20 to-accent-blue/10 flex items-center justify-center text-text-muted">
                  No image available
                </div>
              )}
            </div>

            {/* Sticky sidebar — 1 col */}
            <div className="sticky top-28 self-start space-y-5">
              {/* Tech stack */}
              {project.technologies?.length > 0 && (
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-[10px] font-semibold text-text-heading uppercase tracking-wider mb-4">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech: string) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/[0.08] text-text-sub bg-white/[0.04] hover:border-accent-indigo/40 hover:text-accent-indigo transition-colors cursor-default"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-accent-indigo/10 to-accent-blue/5">
                <h3 className="text-sm font-semibold text-text-heading mb-1">Like what you see?</h3>
                <p className="text-text-muted text-xs mb-4 leading-relaxed">Let's build something amazing together.</p>
                <Link
                  to="/contact"
                  className="block text-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-indigo to-accent-blue text-white text-sm font-semibold hover:shadow-lg hover:shadow-accent-indigo/25 hover:-translate-y-0.5 transition-all"
                >
                  Start a Project
                </Link>
              </div>

              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 text-text-muted hover:text-white text-sm transition-colors group"
              >
                <HiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                All Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge / Solution / Results */}
      <section className="py-16">
        <div className="container-custom space-y-16">

          {(() => {
            const challenges = toArray(project.challenges);
            const solution = toArray(project.solution);
            const results = toArray(project.results);
            if (!challenges.length && !solution.length && !results.length) return null;
            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {challenges.length > 0 && (
                  <div className="glass-card rounded-2xl p-8 border-t-2 border-accent-violet">
                    <span className="w-8 h-8 rounded-lg bg-accent-violet/20 flex items-center justify-center text-accent-violet font-bold text-xs mb-4">01</span>
                    <h3 className="text-base font-semibold text-text-heading mb-3">The Challenge</h3>
                    <ul className="space-y-1.5">
                      {challenges.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-text-body text-sm leading-relaxed">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-violet shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {solution.length > 0 && (
                  <div className="glass-card rounded-2xl p-8 border-t-2 border-accent-cyan">
                    <span className="w-8 h-8 rounded-lg bg-accent-cyan/20 flex items-center justify-center text-accent-cyan font-bold text-xs mb-4">02</span>
                    <h3 className="text-base font-semibold text-text-heading mb-3">Our Solution</h3>
                    <ul className="space-y-1.5">
                      {solution.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-text-body text-sm leading-relaxed">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-cyan shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {results.length > 0 && (
                  <div className="glass-card rounded-2xl p-8 border-t-2 border-accent-blue">
                    <span className="w-8 h-8 rounded-lg bg-accent-blue/20 flex items-center justify-center text-accent-blue font-bold text-xs mb-4">03</span>
                    <h3 className="text-base font-semibold text-text-heading mb-3">The Results</h3>
                    <ul className="space-y-1.5">
                      {results.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-text-body text-sm leading-relaxed">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-blue shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })()}

          {/* About */}
          {(project.description || project.shortDescription) && (
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-text-heading mb-5">About This Project</h2>
              <p className="text-text-body leading-relaxed text-base whitespace-pre-line">
                {project.description || project.shortDescription}
              </p>
            </div>
          )}

          {/* Testimonial */}
          {project.testimonial?.quote && (
            <div className="relative glass-card rounded-2xl p-10 overflow-hidden max-w-3xl">
              <div className="absolute top-2 right-4 text-[120px] leading-none text-accent-indigo/10 font-serif select-none">"</div>
              <p className="text-xl text-text-sub italic leading-relaxed mb-6 relative z-10">
                "{project.testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-indigo to-accent-blue flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {project.testimonial.author?.[0]}
                </div>
                <div>
                  <p className="text-text-heading font-semibold text-sm">{project.testimonial.author}</p>
                  <p className="text-text-muted text-xs">{project.testimonial.role}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
