interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}

export default function SectionHeading({ label, title, subtitle, center = true }: SectionHeadingProps) {
  return (
    <div className={`mb-16 ${center ? 'text-center' : ''}`}>
      {label && (
        <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-semibold uppercase tracking-[0.2em] text-accent-indigo mb-4">
          {label}
        </span>
      )}
      <h2 className="text-display font-bold text-text-heading leading-tight text-balance mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-subtitle text-text-body max-w-2xl leading-relaxed mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
