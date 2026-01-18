"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ReviewSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get current sort from URL or default to newest
  const currentSort = searchParams.get("sort") || "highest";

  const onSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    // Push the new URL: e.g., /?sort=highest
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm  font-medium whitespace-nowrap">
        Sort by:
      </span>
      <Select value={currentSort} onValueChange={onSortChange}>
        <SelectTrigger className="bg-background w-[160px]">
          <SelectValue className="" placeholder="Sort order" />
        </SelectTrigger>
        <SelectContent className="bg-background">
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="highest">Highest Rating</SelectItem>
          <SelectItem value="lowest">Lowest Rating</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}