import { useGsapFadeIn } from '@/hooks/useAnimations';
import SectionHeading from '@/components/ui/SectionHeading';

const steps = [
  { step: '01', title: 'Discovery', description: 'We dive deep to understand your business, goals, and target audience.' },
  { step: '02', title: 'Strategy', description: 'We create a comprehensive roadmap combining design and technology.' },
  { step: '03', title: 'Design', description: 'We craft stunning, user-centered interfaces and experiences.' },
  { step: '04', title: 'Development', description: 'We build with clean, scalable code using modern tech stacks.' },
  { step: '05', title: 'Testing & Launch', description: 'We rigorously test and deploy for a flawless launch.' },
  { step: '06', title: 'Support & Growth', description: 'We provide ongoing optimization and support for continuous growth.' },
];

export default function ProcessSection() {
  const ref = useGsapFadeIn({ stagger: 0.1 });

  return (
    <section className="relative py-32 bg-bg-secondary">
      <div className="container-custom">
        <SectionHeading
          label="Process"
          title="How We Work"
          subtitle="A proven methodology that ensures every project exceeds expectations."
        />

        <div ref={ref} className="relative">
          {/* Timeline line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent-indigo/30 to-transparent" />
          
          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, i) => (
              <div
                key={step.step}
                className={`lg:flex items-center gap-12 ${i % 2 === 0 ? '' : 'lg:flex-row-reverse'} ${
                  i > 0 ? 'lg:mt-0' : ''
                }`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? 'lg:text-right' : ''}`}>
                  <div className="glass rounded-2xl p-8 inline-block">
                    <span className="text-4xl font-bold gradient-text">{step.step}</span>
                    <h3 className="text-xl font-semibold text-text-heading mt-3 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-text-body text-sm leading-relaxed max-w-md">
                      {step.description}
                    </p>
                  </div>
                </div>
                
                {/* Center dot */}
                <div className="hidden lg:flex items-center justify-center w-4 h-4 rounded-full bg-accent-indigo shadow-lg shadow-accent-indigo/50 relative z-10" />
                
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
