import { Skeleton } from "@/components/ui/skeleton";

export default function PersonalDetailsLoading() {
  return (
    <main className="p-6 flex flex-wrap justify-center w-full">
      <div className="max-w-2xl w-full bg-card rounded-xl border p-8 shadow-sm space-y-8">
        {/* Title Skeleton */}
        <div className="flex justify-center">
          <Skeleton className="h-10 w-64 rounded-lg" />
        </div>

        <div className="space-y-6">
          {/* Phone Number Input Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" /> {/* Label */}
            <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
          </div>

          {/* Grid for Street, Status, City, Zip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Flight Number Input Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Button Skeleton */}
          <div className="flex justify-center pt-4">
            <Skeleton className="h-11 w-full md:w-40 rounded-md" />
          </div>
        </div>
      </div>
    </main>
  );
}