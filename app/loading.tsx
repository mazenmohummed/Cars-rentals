import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="w-full">
      {/* 1. Reservation Bar Skeleton */}
      <div className="w-full h-24 bg-card border-b flex items-center justify-center px-6">
        <Skeleton className="h-14 w-full max-w-5xl rounded-full" />
      </div>

      <main className="space-y-12">
        {/* 2. Action Section Skeleton */}
        <div className="px-6 pt-8">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-10 w-3/4 max-w-md" />
            <Skeleton className="h-4 w-1/2 max-w-sm" />
          </div>
        </div>

        {/* 3. Hero Section Skeleton */}
        <section className="relative w-full h-[60vh] md:h-[85vh]">
          <Skeleton className="w-full h-full rounded-none" />
        </section>

        {/* 4. Numbers Section Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-6 max-w-6xl mx-auto py-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center space-y-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>

        {/* 5. Vision Section Skeleton */}
        <div className="flex flex-col md:flex-row gap-10 px-6 max-w-7xl mx-auto py-10">
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex-1">
            <Skeleton className="aspect-video w-full rounded-xl" />
          </div>
        </div>

        {/* 6. Cities Section Skeleton */}
        <div className="px-6 py-10">
          <div className="flex justify-between items-center mb-6 max-w-7xl mx-auto">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}