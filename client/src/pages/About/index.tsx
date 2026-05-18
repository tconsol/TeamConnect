import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useGsapFadeIn } from '@/hooks/useAnimations';
import { cmsQueryOptions } from '@/utils/cmsQueryOptions';
import SectionHeading from '@/components/ui/SectionHeading';
import { AuroraTextEffect } from '@/components/ui/AuroraTextEffect';
import CTASection from '@/sections/home/CTASection';
import ThreeDSlider, { type SliderItemData } from '@/components/ui/ThreeDSlider';
import SkillGlobeSafe from '@/components/ui/SkillGlobeSafe';
import { getCanonicalUrl, breadcrumbJsonLd } from '@/utils/seo';

const valueIcons = ['💡', '✨', '🤝', '🚀'];

export default function About() {
  const location = useLocation();
  const canonicalUrl = getCanonicalUrl(location.pathname);
  
  const valuesRef = useGsapFadeIn({ stagger: 0.1 });
  const storyRef = useGsapFadeIn();

  const { data: cms } = useQuery(cmsQueryOptions('about'));

  const content = cms?.content;
  const values = content?.values || [];
  const team = content?.team || [];

  const breadcrumbs = [
    { name: 'Home', url: 'https://tconsolutions.com' },
    { name: 'About', url: canonicalUrl },
  ];

  return (
    <>
      <Helmet>
        <title>About Us TCON Solutions</title>
        <meta name="description" content="Learn about TCON Solutions a team of innovators building the future of software development. Our mission, values, and approach to creating exceptional digital products." />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="About Us TCON Solutions" />
        <meta property="og:description" content="Learn about our team, mission, and approach to premium software development." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://tconsolutions.com/og-about.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us TCON Solutions" />
        <meta name="twitter:description" content="Learn about our team and approach to premium software development." />
        
        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd(breadcrumbs))}</script>
      </Helmet>

      <div className="overflow-x-clip">

      {/* Hero */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-glow-violet opacity-20" />
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="container-custom relative z-10 text-center">
          <span className="tag mb-6">About Us</span>
          <h1 className="text-hero font-extrabold text-text-heading leading-tight mb-6">
            Building the Future of{' '}
            <AuroraTextEffect text="Digital" />
          </h1>
          <p className="text-subtitle text-text-body max-w-2xl mx-auto leading-relaxed">
            We're a team of passionate developers, designers, and strategists who believe in the power of technology to transform businesses.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-bg-secondary" />
        <div className="absolute inset-0 line-grid opacity-20" />
        <div ref={storyRef} className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="tag mb-4">Our Story</span>
              <h2 className="text-title font-bold text-text-heading mb-6 mt-4">
                From Startup to{' '}
                <AuroraTextEffect text="Industry Leader" />
              </h2>
              <div className="space-y-4 text-text-body leading-relaxed">
                <p>{content?.story || 'Founded with a vision to bridge the gap between innovative technology and real-world business needs, TCON Solutions has grown from a small team of passionate developers into a full-service digital agency.'}</p>
              </div>
            </div>
            <div className="glass-card rounded-3xl aspect-square flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-violet/10 to-accent-blue/5" />
              <div className="relative text-center">
                <div className="text-7xl font-extrabold gradient-text mb-2">5+</div>
                <div className="text-text-muted text-sm uppercase tracking-widest">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-32">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card rounded-2xl p-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-violet/15 to-accent-blue/10 flex items-center justify-center mb-6">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-text-heading mb-4">Our Mission</h3>
              <p className="text-text-body leading-relaxed">
                {content?.mission || 'To empower businesses with cutting-edge technology solutions that drive measurable results, foster innovation, and create lasting digital impact.'}
              </p>
            </div>
            <div className="glass-card rounded-2xl p-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-violet/15 to-accent-blue/10 flex items-center justify-center mb-6">
                <span className="text-2xl">🔭</span>
              </div>
              <h3 className="text-2xl font-bold text-text-heading mb-4">Our Vision</h3>
              <p className="text-text-body leading-relaxed">
                {content?.vision || 'To be the most trusted technology partner for businesses worldwide, known for excellence in execution and relentless pursuit of innovation.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-bg-secondary" />
        <div className="container-custom relative z-10">
          <SectionHeading label="Values" title="What Drives Us" subtitle="The core principles that guide everything we do." auroraFrom={2} />
          <div ref={valuesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value: any, i: number) => (
              <div key={value.title} className="glass-card rounded-2xl p-8 text-center">
                <span className="text-4xl mb-4 block">{valueIcons[i % valueIcons.length]}</span>
                <h3 className="text-lg font-semibold text-text-heading mb-3">{value.title}</h3>
                <p className="text-text-body text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <SkillGlobeSafe />

      {/* Team 3D Slider */}
      <section className="py-16 md:py-32 overflow-hidden">
        <div className="container-custom mb-16">
          <SectionHeading
            label="Team"
            title="Meet Our Leaders"
            subtitle="The brilliant minds behind TCON Solutions."
            auroraFrom={2}
          />
        </div>
        {team.length > 0 && (
          <div className="px-4 md:px-8">
            <ThreeDSlider
              items={team.map((member: any, i: number): SliderItemData => ({
                title: member.name,
                num: String(i + 1).padStart(2, '0'),
                subtitle: member.role,
                description: member.bio,
                image: member.image,
              }))}
              speedWheel={0.025}
              containerStyle={{ height: '460px' }}
            />
          </div>
        )}
      </section>

      <CTASection />
      </div>
    </>
  );
}
