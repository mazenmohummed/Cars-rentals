import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ReservationsLoading() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" /> {/* Title */}
          <Skeleton className="h-4 w-64" /> {/* Subtitle */}
        </div>
        <Skeleton className="h-10 w-32 rounded-md" /> {/* Button */}
      </div>

      {/* Table Skeleton */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead><Skeleton className="h-4 w-24" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead className="text-right"><Skeleton className="h-4 w-24 ml-auto" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Generate 5 rows of skeletons */}
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell className="space-y-2">
                  <Skeleton className="h-5 w-32" /> {/* Car Name */}
                  <Skeleton className="h-3 w-20" /> {/* ID */}
                </TableCell>
                <TableCell className="space-y-2">
                  <Skeleton className="h-4 w-24" /> {/* Date From */}
                  <Skeleton className="h-3 w-20" /> {/* Date To */}
                </TableCell>
                <TableCell className="space-y-2">
                  <Skeleton className="h-4 w-28" /> {/* Route From */}
                  <Skeleton className="h-4 w-28" /> {/* Route To */}
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20 rounded-full" /> {/* Status Badge */}
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-5 w-24 ml-auto" /> {/* Amount */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}