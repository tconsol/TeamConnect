import { Helmet } from 'react-helmet-async';
import HeroSection from '@/sections/home/HeroSection';
import ServicesSection from '@/sections/home/ServicesSection';
import PortfolioSection from '@/sections/home/PortfolioSection';
import ProcessSection from '@/sections/home/ProcessSection';
import TestimonialsSection from '@/sections/home/TestimonialsSection';
import CTASection from '@/sections/home/CTASection';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>TCON Solutions — Premium Software Development</title>
        <meta name="description" content="TCON Solutions crafts premium software, web applications, and digital products for forward-thinking businesses." />
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
