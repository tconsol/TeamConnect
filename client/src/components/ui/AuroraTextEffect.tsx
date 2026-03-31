interface AuroraTextEffectProps {
  text: string;
  className?: string;
  textClassName?: string;
  fontSize?: string;
  colors?: {
    first?: string;
    second?: string;
    third?: string;
    fourth?: string;
  };
  blurAmount?: string;
  animationSpeed?: {
    border?: number;
    first?: number;
    second?: number;
    third?: number;
    fourth?: number;
  };
}

export function AuroraTextEffect({
  text,
  className = '',
  textClassName = '',
  fontSize,
}: AuroraTextEffectProps) {
  const style: React.CSSProperties = {
    background:
      'linear-gradient(135deg, #22d3ee 0%, #86efac 18%, #fbbf24 36%, #f472b6 54%, #c084fc 72%, #60a5fa 90%, #22d3ee 100%)',
    backgroundSize: '300% 300%',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    animation: 'aurora-shift 8s ease infinite',
    display: 'inline',
    fontWeight: 'inherit',
    lineHeight: 'inherit',
    ...(fontSize ? { fontSize } : {}),
  };

  return (
    <span className={className}>
      <span className={textClassName} style={style}>
        {text}
      </span>
    </span>
  );
}
