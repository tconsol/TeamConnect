import { AuroraTextEffect } from './AuroraTextEffect';
import { ScrollReveal } from './ScrollReveal';

interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  /** Word index from which AuroraTextEffect starts (e.g. 2 = last 2 words get aurora) */
  auroraFrom?: number;
}

export default function SectionHeading({ label, title, subtitle, center = true, auroraFrom }: SectionHeadingProps) {
  const words = title.split(' ');
  const splitAt = auroraFrom != null ? Math.max(0, words.length - auroraFrom) : words.length;
  const plainPart = words.slice(0, splitAt).join(' ');
  const auroraPart = words.slice(splitAt).join(' ');

  return (
    <div className={`mb-10 md:mb-12 lg:mb-16 ${center ? 'text-center' : ''}`}>
      {label && (
        <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-semibold uppercase tracking-[0.2em] text-accent-indigo mb-3 md:mb-4">
          {label}
        </span>
      )}
      <h2 className={`text-display font-bold text-text-heading leading-tight text-balance mb-4 ${center ? 'text-center' : ''}`}>
        {plainPart && <span>{plainPart} </span>}
        {auroraPart ? (
          <AuroraTextEffect text={auroraPart} />
        ) : (
          !plainPart && <AuroraTextEffect text={title} />
        )}
      </h2>
      {subtitle && (
        <ScrollReveal
          size="md"
          align={center ? 'center' : 'left'}
          variant="muted"
          containerClassName={`max-w-2xl ${center ? 'mx-auto' : ''}`}
          staggerDelay={0.04}
          duration={0.7}
        >
          {subtitle}
        </ScrollReveal>
      )}
    </div>
  );
}
