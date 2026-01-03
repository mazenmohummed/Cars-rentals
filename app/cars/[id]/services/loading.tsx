import { Skeleton } from "@/components/ui/skeleton";
import { Item } from "@/components/ui/item";

export default function ServicesLoading() {
  return (
    <main className="p-6 flex flex-col items-center w-full">
      {/* Page Title Skeleton */}
      <Skeleton className="h-10 w-64 my-6 rounded-lg" />

      <div className="flex flex-col mx-auto items-center w-full md:w-5/6 lg:w-4/6 space-y-3">
        {/* Generate 5 placeholder service cards */}
        {[1, 2, 3, 4, 5].map((i) => (
          <Item key={i} variant="outline" className="w-full my-2 border p-4">
            <div className="flex flex-row justify-between items-center w-full">
              
              {/* LEFT SIDE: Icon and Text Stack */}
              <div className="flex items-start gap-3">
                {/* Icon Placeholder */}
                <Skeleton className="h-6 w-6 rounded-md mt-1" />
                
                <div className="flex flex-col gap-2">
                  {/* Service Name */}
                  <Skeleton className="h-6 w-32" />
                  {/* Service Description */}
                  <Skeleton className="h-4 w-48 sm:w-64" />
                </div>
              </div>

              {/* RIGHT SIDE: Price and Switch */}
              <div className="flex items-center gap-4">
                {/* Price */}
                <Skeleton className="h-6 w-12" />
                {/* Switch Toggle */}
                <Skeleton className="h-6 w-10 rounded-full" />
              </div>

            </div>
          </Item>
        ))}

        {/* Next Button Skeleton */}
        <Skeleton className="h-12 w-40 my-6 rounded-md" />
      </div>
    </main>
  );
}