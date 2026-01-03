import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function CarsLoading() {
  return (
    <div className="flex flex-col items-center mt-10 w-full max-w-7xl mx-auto px-4">
      {/* Title Skeleton */}
      <Skeleton className="h-10 w-64 mb-8 rounded-lg" />

      {/* Grid of Car Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden border-none shadow-md">
            <CardContent className="p-0">
              {/* Image Area */}
              <Skeleton className="aspect-video w-full rounded-none" />
              
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center">
                  {/* Car Name */}
                  <Skeleton className="h-6 w-32" />
                  {/* Price */}
                  <Skeleton className="h-6 w-20" />
                </div>

                {/* Specs (Seats, Gearbox, etc) */}
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>

                {/* Location info */}
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-5 pt-0">
              {/* Button Skeleton */}
              <Skeleton className="h-10 w-full rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}