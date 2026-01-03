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
import { Button } from "../button";
import { AddMileagePlan } from "../mileage/AddMileagePlan";
import { ICarData, UpdateCar } from "./UpdateCar";
import {IMileagePlanData, UpdateMileagePlan} from "../mileage/UpdateMileagePlan";
import Image from "next/image";



interface IProps {
carInitialData: ICarData,
mileageInitialData?:IMileagePlanData,
limitedPrice:number,
unlimitedPrice:number,
carId:string,  
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



export function AdminCarCard({
  limitedPrice,
  unlimitedPrice,
  carInitialData,
  mileageInitialData,
  carId,
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
 
    <div className="flex min-w-[375px] flex-col gap-6">
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
                    <Image 
                      src={ImgUrl} 
                      alt={Name}
                      fill // Replaces w-full h-full
                      className="absolute inset-0 object-cover"
                      // Since this is likely a car card, use a moderate size to save data
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      // If this car card is at the very top of the list, consider adding priority
                      // priority 
                    />
                 </div>
          
          
          <ItemDescription>
            {Comment}
          </ItemDescription>
          <div className="flex items-end gap-2">
           {/* Daily price */}
             <div className="flex items-baseline gap-1">
               <span className="text-sm font-medium ">E£</span>
               <span className="text-3xl font-bold ">{limitedPrice}</span>
               <span className="text-sm ">/day</span>
             </div>

             {/* Total price */}
             <span className="text-sm ">E£ {unlimitedPrice} Umlimited Price</span>


               

           </div>
           <div className="flex w-full my-4 mx-auto">
           <UpdateCar carId={carId} initialData={carInitialData}/> 
           </div>
           <div className="flex mx-auto gap-4 my-4 ">
            <AddMileagePlan carId={carId}/> 
           <UpdateMileagePlan limitedPrice={limitedPrice} unlimitedPrice={unlimitedPrice} carId={carId} initialData={mileageInitialData}/>
           </div>

        </ItemContent>
      </Item>
    </div>

  )
}
