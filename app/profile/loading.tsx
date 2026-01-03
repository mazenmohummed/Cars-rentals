import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProfileLoading() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Sidebar Skeleton */}
        <Card className="md:col-span-1">
          <CardHeader className="items-center text-center">
            {/* Avatar Skeleton */}
            <Skeleton className="w-20 h-20 rounded-full mb-2" />
            {/* Name Skeleton */}
            <Skeleton className="h-6 w-32 mb-2" />
            {/* Email Skeleton */}
            <Skeleton className="h-4 w-40" />
          </CardHeader>
          
          <CardContent className="space-y-4 flex flex-col items-center pb-6">
            {/* Mode Toggle Placeholder */}
            <Skeleton className="h-10 w-full rounded-md" />
            
            {/* Action Buttons */}
            <div className="w-full space-y-2 pt-4">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-3/4 mx-auto rounded-md" />
            </div>
          </CardContent>
        </Card>

        {/* Edit Form Skeleton */}
        <Card className="md:col-span-2">
          <CardHeader className="flex justify-between flex-row items-center">
            <Skeleton className="h-7 w-24" /> {/* "Settings" Title */}
            <Skeleton className="h-8 w-8 rounded-md" /> {/* Close button */}
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Name Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Form Buttons */}
              <div className="flex flex-col md:flex-row gap-4 pt-2">
                <Skeleton className="h-10 w-full md:w-32" />
                <Skeleton className="h-10 w-full md:w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}