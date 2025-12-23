import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Star, Trash2, ShieldAlert } from "lucide-react";
import { ReviewPagination } from "@/components/ui/reviews/ReviewPagination";

import Image from "next/image";
import { DeleteReviewButton } from "./DeleteReviewButton";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function ManageReviewsPage({ searchParams }: Props) {
 
    

  const resolvedParams = await searchParams;
  const pageSize = 10;
  const currentPage = Number(resolvedParams.page) || 1;

  // 2. Fetch data
  const [reviews, totalCount] = await Promise.all([
    prisma.review.findMany({
      take: pageSize,
      skip: (currentPage - 1) * pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.review.count(),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin: Reviews</h1>
          <p className="text-muted-foreground">Moderate and manage customer feedback.</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold">{totalCount}</span>
          <p className="text-xs uppercase text-muted-foreground font-semibold">Total Reviews</p>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Customer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="w-[400px]">Review</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 rounded-full overflow-hidden border bg-muted">
                      <Image 
                        src={review.avatar || "/placeholder-user.png"} 
                        alt="Avatar" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium leading-none">{review.firstName} {review.lastName}</p>
                      <p className="text-xs text-muted-foreground mt-1">ID: ...{review.id.slice(-5)}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-bold text-foreground">{review.stars}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm line-clamp-2 italic text-muted-foreground">
                    "{review.description}"
                  </p>
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(review.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                   <DeleteReviewButton id={review.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="py-4">
        <ReviewPagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}

