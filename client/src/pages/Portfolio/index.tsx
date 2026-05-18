import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchPortfolios } from '@/utils/api';
import { useGsapFadeIn } from '@/hooks/useAnimations';
import { PageSkeleton } from '@/components/ui/Skeleton';
import SectionHeading from '@/components/ui/SectionHeading';
import { AuroraTextEffect } from '@/components/ui/AuroraTextEffect';
import ImageReveal from '@/components/ui/ImageReveal';
import { getCanonicalUrl, breadcrumbJsonLd } from '@/utils/seo';

const gradientMap = [
  'from-violet-500/20 to-indigo-600/20',
  'from-blue-500/20 to-cyan-600/20',
  'from-emerald-500/20 to-teal-600/20',
  'from-amber-500/20 to-orange-600/20',
  'from-pink-500/20 to-rose-600/20',
  'from-indigo-500/20 to-purple-600/20',
];

export default function Portfolio() {
  const location = useLocation();
  const canonicalUrl = getCanonicalUrl(location.pathname);
  
  const [activeCategory, setActiveCategory] = useState('All');
  const ref = useGsapFadeIn({ stagger: 0.1 });

  const breadcrumbs = [
    { name: 'Home', url: 'https://tconsolutions.com' },
    { name: 'Portfolio', url: canonicalUrl },
  ];

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['portfolios'],
    queryFn: () => fetchPortfolios(),
    staleTime: 45 * 60 * 1000,
    refetchInterval: 50 * 60 * 1000,
    refetchOnMount: true,
  });

  const categories = useMemo(() => {
    const cats = Array.from(new Set((projects as any[]).map((p: any) => p.category).filter(Boolean)));
    return ['All', ...cats];
  }, [projects]);

  const filtered = activeCategory === 'All'
    ? projects
    : (projects as any[]).filter((p: any) => p.category === activeCategory);

  if (isLoading) return <PageSkeleton />;

  return (
    <>
      <Helmet>
        <title>Portfolio TCON Solutions</title>
        <meta name="description" content="Explore our portfolio of premium digital products and successful client projects across web, mobile, cloud, and AI solutions." />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Portfolio TCON Solutions" />
        <meta property="og:description" content="Explore our portfolio of successful digital projects and client work." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://tconsolutions.com/og-portfolio.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Portfolio TCON Solutions" />
        <meta name="twitter:description" content="Check out our portfolio of premium digital products." />
        
        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd(breadcrumbs))}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-glow-violet opacity-20" />
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="container-custom relative z-10 text-center">
          <span className="tag mb-6">Portfolio</span>
          <h1 className="text-hero font-extrabold text-text-heading leading-tight mb-6">
            Our{' '}
            <AuroraTextEffect text="Work" />
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
                    ? 'bg-gradient-to-r from-accent-violet to-accent-cyan text-white shadow-lg shadow-accent-violet/20'
                    : 'glass-card text-text-body hover:text-white'
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
            {(filtered as any[]).map((project: any, i: number) => (
              <Link
                key={project._id || i}
                to={`/portfolio/${project.slug}`}
                className="group glass-card rounded-2xl overflow-hidden"
              >
                {project.thumbnail ? (
                  <div className="overflow-hidden bg-black/20 max-h-60">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-auto object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                ) : (
                  <div className={`aspect-video bg-gradient-to-br ${gradientMap[i % gradientMap.length]} group-hover:scale-105 transition-transform duration-700`} />
                )}
                <div className="p-6">
                  <span className="tag text-[10px]">{project.category}</span>
                  <h3 className="text-xl font-semibold text-text-heading mt-3 mb-2 group-hover:gradient-text transition-all">
                    {project.title}
                  </h3>
                  <p className="text-text-body text-sm leading-relaxed line-clamp-2 mb-4">
                    {project.shortDescription}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(project.technologies || []).slice(0, 4).map((tech: string) => (
                      <span key={tech} className="px-2.5 py-1 rounded-md text-[11px] border border-white/[0.08] text-text-muted bg-white/[0.03]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {(filtered as any[]).length === 0 && (
            <div className="text-center py-20">
              <p className="text-text-muted text-lg">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Capabilities Image Reveal Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-bg-secondary" />
        <div className="container-custom relative z-10">
          <SectionHeading
            label="Capabilities"
            title="What We Build"
            subtitle="Hover over each category to explore our expertise areas."
            auroraFrom={2}
          />
          <ImageReveal
            imageWidth={300}
            imageHeight={380}
            visualData={[
              { key: 1, url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&q=80', label: 'Web Applications', tag: 'Development' },
              { key: 2, url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&q=80', label: 'Mobile Experiences', tag: 'Mobile' },
              { key: 3, url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80', label: 'Cloud Infrastructure', tag: 'Cloud' },
              { key: 4, url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80', label: 'UI/UX Design', tag: 'Design' },
              { key: 5, url: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80', label: 'AI & Machine Learning', tag: 'AI' },
            ]}
          />
        </div>
      </section>
    </>
  );
}
