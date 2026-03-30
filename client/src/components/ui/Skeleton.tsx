interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-white/[0.06] rounded-lg ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen pt-32 container-custom space-y-8">
      <Skeleton className="h-12 w-1/3 mx-auto" />
      <Skeleton className="h-6 w-2/3 mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
