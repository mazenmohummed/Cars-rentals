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

export function ReviewCard({Name,Comment,ImgUrl}: IProps) {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Item variant="outline">
        <ItemContent>
          <div className="flex">
            <div className="pr-6">
          <Avatar>
            <AvatarImage src={ImgUrl} alt={Name}/>
           <AvatarFallback>CN</AvatarFallback>
           </Avatar>
            </div>
          <ItemTitle>{Name}</ItemTitle>
          </div>
          <ItemDescription>
            {Comment}
          </ItemDescription>
        </ItemContent>
      </Item>
    </div>
  )
}
