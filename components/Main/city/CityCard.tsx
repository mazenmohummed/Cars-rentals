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
    <div className="flex w-full max-w-md  flex-col gap-6">
      <Item variant="outline" className="h-fit bg-primary ">
        <ItemContent className="flex flex-col h-full">          
                 <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg">
                    <Image
                      src={ImgUrl}
                      alt={Name}
                      fill // Replaces h-full w-full
                      priority // Use this if this image is at the top of the page (LCP fix)
                      className="absolute inset-0 object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                 </div>
          <ItemTitle className="text-white text-2xl">{Name}</ItemTitle>
          
          <ItemDescription className="h-auto block text-white line-clamp-none whitespace-normal text-pretty">
            {Comment}
          </ItemDescription>
        </ItemContent>
      </Item>
    </div>
  )
}
