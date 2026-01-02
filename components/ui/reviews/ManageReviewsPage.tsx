import { prisma } from "@/lib/prisma";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Star, Calendar, User } from "lucide-react";
import { ReviewPagination } from "@/components/ui/reviews/ReviewPagination";
import Image from "next/image";
import { DeleteReviewButton } from "./DeleteReviewButton";
import { ReviewFilter } from "./ReviewFilter";

interface Props {
  searchParams: Promise<{ page?: string, sort?: string }>;
}

export default async function ManageReviewsPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const pageSize = 10;
  const currentPage = Number(resolvedParams.page) || 1;
  const sort = resolvedParams.sort || "newest";

  const getOrderBy = () => {
    switch (sort) {
      case "highest": return { stars: "desc" as const };
      case "lowest": return { stars: "asc" as const };
      case "newest": 
      default: return { createdAt: "desc" as const };
    }
  };

  const [reviews, totalCount] = await Promise.all([
    prisma.review.findMany({
      take: pageSize,
      skip: (currentPage - 1) * pageSize,
      orderBy: getOrderBy(),
    }),
    prisma.review.count(),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* HEADER SECTION - Stacked on mobile, side-by-side on desktop */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end border-b pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin: Reviews</h1>
          <p className="text-sm text-muted-foreground">Moderate and manage customer feedback.</p>
        </div>
        
        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
          <ReviewFilter /> 
          <div className="text-right">
            <span className="text-xl md:text-2xl font-bold">{totalCount}</span>
            <p className="text-[10px] uppercase text-muted-foreground font-semibold">Total Reviews</p>
          </div>
        </div>
      </div>

      {/* MOBILE VIEW: Card Layout (Hidden on md and up) */}
      <div className="space-y-4 md:hidden">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden border bg-muted shrink-0">
                  <Image 
                    src={review.avatar || "/placeholder-user.png"} 
                    alt="Avatar" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm">{review.firstName} {review.lastName}</p>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="text-xs font-bold text-foreground">{review.stars}</span>
                  </div>
                </div>
              </div>
              <DeleteReviewButton id={review.id} />
            </div>

            <p className="text-sm italic text-muted-foreground line-clamp-4 leading-relaxed bg-muted/30 p-2 rounded">
              "{review.description}"
            </p>

            <div className="flex items-center justify-between pt-2 border-t text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
              <span>ID: ...{review.id.slice(-5)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP VIEW: Table Layout (Hidden on mobile) */}
      <div className="hidden md:block rounded-md border bg-card overflow-hidden">
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

      {/* PAGINATION */}
      <div className="py-6 border-t md:border-none">
        <ReviewPagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}