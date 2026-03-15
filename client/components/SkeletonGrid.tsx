import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SkeletonGridProps {
  columns?: number;
  count?: number;
  className?: string;
}

export default function SkeletonGrid({
  columns = 4,
  count = 8,
  className = "",
}: SkeletonGridProps) {
  return (
    <div
      className={cn(
        `grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`,
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card rounded-[20px] overflow-hidden border border-slate-700/50">
          {/* Image Skeleton */}
          <Skeleton className="h-48 w-full rounded-none" />
          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-3/4 rounded-lg" />
            <Skeleton className="h-3 w-1/2 rounded-lg" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-2 flex-1 rounded-full" />
              <Skeleton className="h-2 flex-1 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface SkeletonListProps {
  count?: number;
  className?: string;
}

export function SkeletonList({ count = 5, className = "" }: SkeletonListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-lg border border-slate-700/50 bg-card space-y-2"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-20 rounded-full" />
            <Skeleton className="h-4 flex-1 rounded-lg" />
          </div>
          <Skeleton className="h-3 w-3/4 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
