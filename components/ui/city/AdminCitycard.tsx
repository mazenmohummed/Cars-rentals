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
import Image from "next/image"



export function AdminCityCard({cityId,initialData}: UpdateCityProps) {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Item variant="outline">
        <ItemContent>          
                 <div className="relative w-full aspect-video overflow-hidden rounded-lg">
                    <Image
                        src={initialData.image}
                        alt={initialData.name}
                        fill // Replaces h-full w-full
                        priority // Use this if this image is at the top of the page (LCP fix)
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
