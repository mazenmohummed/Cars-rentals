import { prisma } from "@/lib/prisma";
import { ReviewCard } from "./ReviewCard";
import { ReviewSort } from "./ReviewSort";
import { ReviewPagination } from "./ReviewPagination"; // We will create this below
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  searchParams: { sort?: string; page?: string };
}

export async function ReviewsSection({ searchParams }: Props) {
  // 1. Configuration
  const pageSize = 3;
  const currentPage = Number(searchParams.page) || 1;
  const sort = searchParams.sort || "highest"; // Default changed to highest

  let orderBy: any = { stars: "desc" }; // Default order
  if (sort === "newest") orderBy = { createdAt: "desc" };
  if (sort === "lowest") orderBy = { stars: "asc" };

  // 2. Fetch data and total count in parallel
  const [reviews, totalReviews] = await Promise.all([
    prisma.review.findMany({
      orderBy: orderBy,
      take: pageSize,
      skip: (currentPage - 1) * pageSize,
    }),
    prisma.review.count(),
  ]);

  const totalPages = Math.ceil(totalReviews / pageSize);

  // 3. Calculate Average (on all reviews, not just the 3 displayed)
  // Note: For large datasets, use prisma.review.aggregate instead
  const allReviewsForAvg = await prisma.review.findMany({ select: { stars: true } });
  const averageRating = allReviewsForAvg.length > 0 
    ? (allReviewsForAvg.reduce((acc, curr) => acc + curr.stars, 0) / allReviewsForAvg.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-8 mb-6">

      {/* Sorting Controls Row */}
      <div className="flex flex-col lg:flex-row    items-center justify-between border-b pb-4">
        <h3 className="text-sm font-medium uppercase tracking-wider ">Average Rating</h3>
        <div className="flex  mt-3 gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                "h-5 w-5",
                star <= Math.round(Number(averageRating)) 
                  ? "fill-yellow-400 text-yellow-400" 
                  : "text-muted-foreground"
              )}
            />
          ))}
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-5xl font-bold  tracking-tighter">{averageRating}</span>
          <span className="text-xl text-muted-foreground">/ 5</span>
        </div>
        <p className="mt-2 text-sm  text-muted-foreground">Based on {totalReviews} reviews</p>
        <ReviewSort />
      </div>

      {/* Grid List of Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            name={`${review.firstName ?? ""} ${review.lastName ?? ""}`}
            comment={review.description ?? ""}
            imgUrl={review.avatar ?? ""}
            stars={review.stars}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <ReviewPagination totalPages={totalPages} currentPage={currentPage} />
      )}
    </div>
  );
}