export default function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

export function PostSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-[3px] mb-4">
      <div className="flex items-center p-3 space-x-3">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="w-full aspect-square" />
      <div className="p-3 space-y-3">
        <div className="flex space-x-4">
          <Skeleton className="w-7 h-7" />
          <Skeleton className="w-7 h-7" />
          <Skeleton className="w-7 h-7" />
        </div>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
