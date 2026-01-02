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
import { UpdateCity, UpdateCityProps } from "./UpdateCity"



export function AdminCityCard({cityId,initialData}: UpdateCityProps) {
  return (
    // <div className="flex w-full max-w-md flex-col gap-6">
    //   <Item variant="outline">
    //     <ItemContent>          
    //              <div className="relative mx-auto w-full pb-4 ">
    //                 <img 
    //                 src={initialData.image} 
    //                 alt={initialData.name}
    //                 className=" object-cover"
    //                 />
    //              </div>
    //       <ItemTitle className="text-2xl">{initialData.name}</ItemTitle>
          
    //       <ItemDescription>
    //         {initialData.description}
    //       </ItemDescription>
    //       <UpdateCity initialData={initialData} cityId={cityId}/>
    //     </ItemContent>
    //   </Item>
    // </div>
    <div className="flex w-full max-w-md flex-col gap-6">
      <Item variant="outline">
        <ItemContent>          
                 <div className="relative w-full aspect-video overflow-hidden rounded-lg">
                    <img 
                    src={initialData.image} 
                    alt={initialData.name}
                    className=" absolute inset-0 w-full h-full object-cover"
                    />
                 </div>
          <ItemTitle className="text-2xl">{initialData.name}</ItemTitle>
          
          <ItemDescription>
            {initialData.description}
          </ItemDescription>
          <UpdateCity initialData={initialData} cityId={cityId}/>
        </ItemContent>
      </Item>
    </div>
  )
}
