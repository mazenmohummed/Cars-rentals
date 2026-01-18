import { BadgeCheckIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";


interface ReviewCardProps {
  name: string;
  comment: string;
  imgUrl: string;
  stars: number;
}

export function ReviewCard({ name, comment, imgUrl, stars }: ReviewCardProps) {
  return (
   <Item variant="outline" className=" bg-primary h-full">
      <ItemContent className=" space-y-3">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={imgUrl} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <ItemTitle className="text-sm text-white font-semibold">{name}</ItemTitle>
            {/* Render Stars */}
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={cn(
                    "h-3.5 w-3.5",
                    s <= stars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
        <ItemDescription className=" text-white line-clamp-3">
          {comment}
        </ItemDescription>
      </ItemContent>
    </Item>
  )
}
