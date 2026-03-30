import { Helmet } from 'react-helmet-async';
import { useGsapFadeIn } from '@/hooks/useAnimations';
import SectionHeading from '@/components/ui/SectionHeading';
import CTASection from '@/sections/home/CTASection';

const values = [
  { title: 'Innovation', description: 'We push boundaries and embrace new technologies to stay ahead of the curve.', icon: '💡' },
  { title: 'Quality', description: 'We deliver nothing less than excellence in every line of code and pixel we craft.', icon: '✨' },
  { title: 'Integrity', description: 'We build trust through transparency, honesty, and ethical business practices.', icon: '🤝' },
  { title: 'Collaboration', description: 'We believe the best solutions emerge from diverse perspectives working together.', icon: '🚀' },
];

const team = [
  { name: 'Alex Johnson', role: 'CEO & Founder' },
  { name: 'Sarah Chen', role: 'CTO' },
  { name: 'Mike Williams', role: 'Lead Designer' },
  { name: 'Emily Davis', role: 'Project Manager' },
];

export default function About() {
  const valuesRef = useGsapFadeIn({ stagger: 0.1 });
  const teamRef = useGsapFadeIn({ stagger: 0.1 });
  const storyRef = useGsapFadeIn();

  return (
    <>
      <Helmet>
        <title>About Us — TCON Solutions</title>
        <meta name="description" content="Learn about TCON Solutions — a team of innovators building the future of software." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-glow-indigo opacity-20" />
        <div className="container-custom relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-semibold uppercase tracking-[0.2em] text-accent-indigo mb-6">
            About Us
          </span>
          <h1 className="text-hero font-bold text-text-heading leading-tight mb-6">
            Building the Future of{' '}
            <span className="gradient-text">Digital</span>
          </h1>
          <p className="text-subtitle text-text-body max-w-2xl mx-auto leading-relaxed">
            We're a team of passionate developers, designers, and strategists who believe in the power of technology to transform businesses.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-32 bg-bg-secondary">
        <div ref={storyRef} className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-indigo mb-4 block">Our Story</span>
              <h2 className="text-title font-bold text-text-heading mb-6">
                From Startup to Industry Leader
              </h2>
              <div className="space-y-4 text-text-body leading-relaxed">
                <p>
                  Founded with a vision to bridge the gap between design and technology, TCON Solutions has grown from a small startup into a trusted digital partner for businesses worldwide.
                </p>
                <p>
                  Our team combines deep technical expertise with creative thinking to deliver solutions that not only look stunning but also perform flawlessly. We believe that great software is built at the intersection of art and engineering.
                </p>
                <p>
                  Today, we serve clients across industries — from fintech startups to enterprise healthcare platforms — always maintaining our commitment to quality, innovation, and client success.
                </p>
              </div>
            </div>
            <div className="glass rounded-3xl aspect-square flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold gradient-text mb-2">5+</div>
                <div className="text-text-muted">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-32">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass rounded-2xl p-10 glow-hover transition-all duration-500">
              <span className="text-4xl mb-6 block">🎯</span>
              <h3 className="text-2xl font-bold text-text-heading mb-4">Our Mission</h3>
              <p className="text-text-body leading-relaxed">
                To deliver cutting-edge digital solutions that drive growth, efficiency, and innovation for businesses worldwide. We're committed to turning complex challenges into elegant, scalable solutions.
              </p>
            </div>
            <div className="glass rounded-2xl p-10 glow-hover transition-all duration-500">
              <span className="text-4xl mb-6 block">🔭</span>
              <h3 className="text-2xl font-bold text-text-heading mb-4">Our Vision</h3>
              <p className="text-text-body leading-relaxed">
                To be the most trusted technology partner for businesses seeking digital transformation. We envision a world where technology empowers every organization to reach its full potential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 bg-bg-secondary">
        <div className="container-custom">
          <SectionHeading label="Values" title="What Drives Us" subtitle="The core principles that guide everything we do." />
          <div ref={valuesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="glass rounded-2xl p-8 text-center hover:bg-white/[0.08] transition-all duration-500">
                <span className="text-4xl mb-4 block">{value.icon}</span>
                <h3 className="text-lg font-semibold text-text-heading mb-3">{value.title}</h3>
                <p className="text-text-body text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-32">
        <div className="container-custom">
          <SectionHeading label="Team" title="Meet Our Leaders" subtitle="The brilliant minds behind TCON Solutions." />
          <div ref={teamRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="group glass rounded-2xl overflow-hidden hover:bg-white/[0.08] transition-all duration-500">
                <div className="aspect-square bg-gradient-to-br from-accent-indigo/10 to-accent-blue/10 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-indigo to-accent-blue flex items-center justify-center text-3xl font-bold">
                    {member.name[0]}
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-lg font-semibold text-text-heading">{member.name}</h3>
                  <p className="text-text-muted text-sm mt-1">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
