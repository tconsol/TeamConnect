import { useQuery } from '@tanstack/react-query';
import { cmsQueryOptions } from '@/utils/cmsQueryOptions';
import SectionHeading from '@/components/ui/SectionHeading';
import ScrollTimeline from '@/components/ui/ScrollTimeline';

export default function ProcessSection() {
  const { data: cms } = useQuery(cmsQueryOptions('home'));

  const steps = cms?.content?.process || [];

  if (steps.length === 0) return null;

  const events = steps.map((step: any) => ({
    year: step.step,
    title: step.title,
    description: step.description,
  }));

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-bg-secondary" />
      <div className="absolute inset-0 dot-pattern opacity-40" />

      <div className="container-custom relative z-10">
        <SectionHeading
          label="Process"
          title="How We Work"
          subtitle="A proven methodology that ensures every project exceeds expectations."
          auroraFrom={2}
        />

        <ScrollTimeline events={events} />
      </div>
    </section>
  );
}
