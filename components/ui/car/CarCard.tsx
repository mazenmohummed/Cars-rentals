import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { Badge } from "@/components/ui/badge"
import { User } from 'lucide-react';
import { Luggage } from 'lucide-react';
import { GiCarDoor } from "react-icons/gi";

interface IProps {
Name:string,
Comment:string,
ImgUrl: string,
Type: string,
DayPrice: number,
TotalPrice: number,
seats:number,
bags: number,
doors:number,
automatic:boolean,
}

export function CarCard({
  Name,
  Comment,
  ImgUrl,
  Type,
  DayPrice,
  TotalPrice,
  seats,
  bags,
  doors,
  automatic,
}: IProps) {
  return (
    <div className="flex w-full min-w-[375px] flex-col gap-6">
          <Item variant="outline">
            <ItemContent>
    
                <ItemTitle className="text-2xl">{Name}</ItemTitle>
                <ItemTitle className="text-2xl">{Type}</ItemTitle>
                <div className="flex gap-2">
                <Badge variant="outline"><User />{seats}</Badge>
                <Badge variant="outline"><Luggage />{bags}</Badge>
                <Badge variant="outline"><GiCarDoor />{doors}</Badge>
                {automatic && <Badge>Automatic</Badge>}
                </div>
                     <div className="relative w-full aspect-video overflow-hidden rounded-lg">
                        <img 
                        src={ImgUrl} 
                        alt={Name}
                        className=" absolute inset-0 w-full h-full object-cover"
                        />
                     </div>
              
              
              <ItemDescription>
                {Comment}
              </ItemDescription>
              <div className="flex items-end gap-2">
               {/* Daily price */}
                 <div className="flex items-baseline gap-1">
                   <span className="text-sm font-medium ">€</span>
                   <span className="text-3xl font-bold ">{DayPrice}</span>
                   <span className="text-sm ">/day</span>
                 </div>
    
                 {/* Total price */}
                 <span className="text-sm ">€ {TotalPrice} Total</span>
    
    
                   
    
               </div>
    
            </ItemContent>
          </Item>
        </div>

  )
}
