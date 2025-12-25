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
                    <img 
                    src={ImgUrl} 
                    alt={Name}
                    className=" absolute inset-0 w-full h-full object-cover"
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
