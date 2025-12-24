// components/ReserveCard.jsx
"use client";

import React from "react";

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import Link from "next/link";
import { useState } from "react";
import { User } from 'lucide-react';
import { Luggage } from 'lucide-react';
import { GiCarDoor } from "react-icons/gi";
import { differenceInDays, parseISO } from "date-fns";


interface IReserveCard {
 Name: string;
  Comment: string;
  ImgUrl: string;
  Type: string;
  unlimitedPrice: number | null;
  limitedPrice: number | null;
  MileageKM: number | null;
  Id: string;
  seats: number;
  bags: number;
  doors: number;
  automatic: boolean;
  extraKmPrice:number | null;
  fromDate?: string;
  toDate?: string;
  cityFees: number;
  pickupCity:string | undefined,
  returnCity:string | undefined,
}



export default function ReserveCard({ 
  Name, 
  Type, 
  ImgUrl, 
  Comment, 
  unlimitedPrice,
  limitedPrice,
  MileageKM,
  Id,
  seats,
  bags,
  doors,
  automatic,
  extraKmPrice,
  fromDate,
  toDate,
  cityFees,
  pickupCity,
  returnCity
 }: IReserveCard ) {
  
  const [Mileage, setMileage] = useState<string | null>(null);

  // 1. Calculate Days
  const rentalDays = (fromDate && toDate) 
    ? Math.max(differenceInDays(parseISO(toDate), parseISO(fromDate)), 1) 
    : 1;

  // 2. Determine Daily Price based on selection
  const currentDailyPrice = Mileage === "unlimited" ? (unlimitedPrice ?? 0) : (limitedPrice ?? 0);  
  
  // 3. Final Calculation: (Daily * Days) + City Fees
  const totalPrice = (currentDailyPrice * rentalDays) + cityFees;

  
  return (

    <div className="flex w-full md:w-5/6 xl:w-5/6  lg:w-5/6 mx-auto  h-auto ">
      <Item variant="outline" className=" w-full flex h-auto">
        <div className="flex w-full flex-wrap">

        <ItemContent className="m-2">

            <ItemTitle className="text-2xl">{Name}</ItemTitle>
            <ItemTitle className="text-2xl">{Type}</ItemTitle>
            <div className="flex gap-2">
            <Badge variant="outline"><User />{seats}</Badge>
            <Badge variant="outline"><Luggage />{bags}</Badge>
            <Badge variant="outline"><GiCarDoor />{doors}</Badge>
            {automatic && <Badge>Automatic</Badge>}
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
          
           {/* Daily price */}
          <div className="flex items-end gap-2">
             <div className="flex items-baseline gap-1">
               <span className="text-sm font-medium ">E£</span>
               <span className="text-3xl font-bold ">{currentDailyPrice}</span>
               <span className="text-sm ">/day</span>
             </div>
              
             {/* Total price */}
             <span className="text-sm ">E£ {totalPrice} total</span>

               

           </div>

        </ItemContent>
        <ItemContent className="m-2">
          <ItemTitle className="text-2xl mx-6 ">Mileage</ItemTitle>
          <div className="rid content-end h-full">
          <Item variant="outline"  className={`my-6 w-96 cursor-pointer ${
        Mileage === "unlimited" ? "ring-2  dark:ring-white ring-black" : ""
      }`}
      onClick={() => setMileage ("unlimited")} >
            <ItemContent>
            <ItemTitle className="text-2xl " >Unlimted</ItemTitle>
             <ItemDescription >
            All kilometers are included in the price
          </ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="outline" className={`my-6 w-96 cursor-pointer ${
        Mileage === `${MileageKM}`? "ring-2  dark:ring-white ring-black" : ""
      }`}
      onClick={() => setMileage (`${MileageKM}`)} >
            <ItemContent>
            <ItemTitle className="text-2xl">{MileageKM} KM</ItemTitle>
            <ItemDescription>
            +EGP {extraKmPrice} / for every additional km
          </ItemDescription>
            </ItemContent>
          </Item>
          <Link href={`/cars/${Id}/services?from=${fromDate}&to=${toDate}&pickup=${pickupCity}&return=${returnCity}&mileage=${Mileage}`}>
        <Button className="mx-6 w-40">Next</Button>
      </Link>
          </div>
        </ItemContent>
      </div>
      </Item>
    </div>
  );
}
