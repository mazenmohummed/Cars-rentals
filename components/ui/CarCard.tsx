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
import { Badge } from "@/components/ui/badge"
import Link from "next/link";

interface IProps {
Name:string,
Comment:string,
ImgUrl: string,
Type: string,
DayPrice: number,
TotalPrice: number,
}

export function CarCard({Name,Comment,ImgUrl,Type,DayPrice,TotalPrice,}: IProps) {
  return (
 
    <div className="flex w-full max-w-md flex-col gap-6">
      <Item variant="outline">
        <ItemContent>

            <ItemTitle className="text-2xl">{Name}</ItemTitle>
            <ItemTitle className="text-2xl">{Type}</ItemTitle>
            <div>
            <Badge variant="outline">one</Badge>
            <Badge variant="outline">two</Badge>
            <Badge variant="outline">three</Badge>
            </div>
                 <div className="relative mx-auto w-full pb-4 ">
                    <img 
                    src={ImgUrl} 
                    alt={Name}
                    className=" object-cover"
                    />
                 </div>
          
          
          <ItemDescription>
            {Comment}
          </ItemDescription>
          <div className="flex items-end gap-2">
           {/* Daily price */}
             <div className="flex items-baseline gap-1">
               <span className="text-sm font-medium text-gray-300">E£</span>
               <span className="text-3xl font-bold text-white">{DayPrice}</span>
               <span className="text-sm text-gray-300">/day</span>
             </div>

             {/* Total price */}
             <span className="text-sm text-gray-400">E£ {TotalPrice} total</span>

               

           </div>

        </ItemContent>
      </Item>
    </div>

  )
}
