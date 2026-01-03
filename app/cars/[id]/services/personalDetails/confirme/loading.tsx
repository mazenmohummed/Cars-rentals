import { Skeleton } from "@/components/ui/skeleton";
import { Item } from "@/components/ui/item";

export default function ConfirmationLoading() {
  return (
    <main className="p-6 flex flex-col items-center w-full">
      <div className="flex w-full md:w-5/6 xl:w-4/6 lg:w-5/6 mx-auto h-auto">
        <Item variant="outline" className="w-full flex h-auto p-4 md:p-6 border shadow-sm">
          <div className="flex w-full flex-wrap lg:flex-nowrap gap-8">
            
            {/* LEFT SIDE: Car Preview Skeleton */}
            <div className="flex-1 space-y-4 min-w-[300px]">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" /> {/* Car Name */}
                <Skeleton className="h-6 w-32" /> {/* Car Type */}
              </div>
              
              {/* Badges */}
              <div className="flex gap-2">
                <Skeleton className="h-6 w-12 rounded-full" />
                <Skeleton className="h-6 w-12 rounded-full" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>

              {/* Image Placeholder */}
              <Skeleton className="relative w-full aspect-video rounded-lg" />
              
              {/* Comment & Daily Price */}
              <Skeleton className="h-4 w-full" />
              <div className="pt-4">
                <Skeleton className="h-10 w-32" />
              </div>
            </div>

            {/* RIGHT SIDE: Booking Summary Skeleton */}
            <div className="flex-[1.2] space-y-6">
              <Skeleton className="h-8 w-48" /> {/* "Booking Summary" Title */}

              {/* Pickup/Return Grid */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>

              {/* Table Skeleton */}
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between border-b pb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-16" />
                </div>
                {/* Rows */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                {/* Footer/Total */}
                <div className="border-t pt-4 flex justify-between items-center">
                  <Skeleton className="h-7 w-32" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>

              {/* Confirm Button */}
              <Skeleton className="h-12 w-full rounded-md mt-2" />
            </div>

          </div>
        </Item>
      </div>
    </main>
  );
}