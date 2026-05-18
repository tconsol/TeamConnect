import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import HeroSection from '@/sections/home/HeroSection';
import ServicesSection from '@/sections/home/ServicesSection';
import PortfolioSection from '@/sections/home/PortfolioSection';
import ProcessSection from '@/sections/home/ProcessSection';
import TestimonialsSection from '@/sections/home/TestimonialsSection';
import CTASection from '@/sections/home/CTASection';
import { getCanonicalUrl, organizationJsonLd } from '@/utils/seo';

export default function Home() {
  const location = useLocation();
  const canonicalUrl = getCanonicalUrl(location.pathname);

  return (
    <>
      <Helmet>
        <title>TCON Solutions Premium Software Development</title>
        <meta name="description" content="TCON Solutions crafts premium software, web applications, and digital products for forward-thinking businesses. Strategy, design, and engineering at scale." />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="TCON Solutions Premium Software Development" />
        <meta property="og:description" content="Crafting premium software, web applications, and digital products for forward-thinking businesses." />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://tconsolutions.com/og-image.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TCON Solutions Premium Software Development" />
        <meta name="twitter:description" content="Crafting premium software, web applications, and digital products." />
        <meta name="twitter:image" content="https://tconsolutions.com/og-image.png" />
        
        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(organizationJsonLd)}</script>
      </Helmet>
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <ProcessSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
