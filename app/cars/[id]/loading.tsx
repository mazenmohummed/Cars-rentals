import { Skeleton } from "@/components/ui/skeleton";
import { Item } from "@/components/ui/item";

export default function CarDetailsLoading() {
  return (
    <div className="flex py-4 w-full md:w-5/6 mx-auto h-auto px-2">
      <Item variant="outline" className="w-full flex h-auto overflow-hidden border p-6">
        <div className="flex w-full flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDE: Car Details Skeleton */}
          <div className="flex-1 space-y-4">
            {/* Title & Type */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-24" />
            </div>
            
            {/* Badges */}
            <div className="flex gap-2">
              <Skeleton className="h-6 w-12 rounded-full" />
              <Skeleton className="h-6 w-12 rounded-full" />
              <Skeleton className="h-6 w-12 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            {/* Car Image Area */}
            <Skeleton className="relative w-full aspect-video sm:aspect-[16/9] lg:h-64 rounded-lg" />
          
            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            
            {/* Price Footer */}
            <div className="border-t pt-4 space-y-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>

          {/* RIGHT SIDE: Selection Skeleton */}
          <div className="flex-1 border-t lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-8 space-y-6">
            <Skeleton className="h-7 w-40 mb-4" />
            
            {/* Mileage Option 1 */}
            <div className="space-y-3">
              <Skeleton className="h-20 w-full rounded-lg" />
              {/* Mileage Option 2 */}
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>

            {/* Next Button */}
            <Skeleton className="h-12 w-full rounded-md mt-4" />
            
            {/* Helper Text */}
            <div className="flex justify-center">
              <Skeleton className="h-3 w-32" />
            </div>
          </div>

        </div>
      </Item>
    </div>
  );
}