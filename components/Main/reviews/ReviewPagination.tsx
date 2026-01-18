"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ReviewPagination({ totalPages, currentPage }: { totalPages: number; currentPage: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage <= 1}
        onClick={() => router.push(createPageUrl(currentPage - 1), { scroll: false })}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="text-sm  font-medium">
        Page {currentPage} of {totalPages}
      </div>

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage >= totalPages}
        onClick={() => router.push(createPageUrl(currentPage + 1), { scroll: false })}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}