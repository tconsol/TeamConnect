import { Suspense, lazy } from 'react';

const SkillGlobe = lazy(() => 
  import('./SkillGlobe').catch(err => {
    console.error('Failed to load SkillGlobe:', err);
    // Return a fallback component
    return { default: () => (
      <section className="py-16 md:py-32 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-text-muted">Unable to load skills visualization. Please try refreshing the page.</p>
        </div>
      </section>
    ) };
  })
);

export default function SkillGlobeSafe() {
  return (
    <Suspense fallback={
      <section className="py-16 md:py-32 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full border-2 border-accent-violet/20 border-t-accent-violet animate-spin mx-auto mb-4" />
          <p className="text-text-muted">Loading skill ecosystem...</p>
        </div>
      </section>
    }>
      <SkillGlobe />
    </Suspense>
  );
}
