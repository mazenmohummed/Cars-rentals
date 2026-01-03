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
import Image from "next/image"

interface IProps {
Name:string,
Comment:string,
ImgUrl: string,
}

export function CityCard({Name,Comment,ImgUrl}: IProps) {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Item variant="outline">
        <ItemContent>          
                 <div className="relative w-full aspect-video overflow-hidden rounded-lg">
                    <Image
                      src={ImgUrl}
                      alt={Name}
                      fill // Replaces h-full w-full
                      priority // Use this if this image is at the top of the page (LCP fix)
                      className="absolute inset-0 object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                 </div>
          <ItemTitle className="text-2xl">{Name}</ItemTitle>
          
          <ItemDescription>
            {Comment}
          </ItemDescription>
        </ItemContent>
      </Item>
    </div>
  )
}
