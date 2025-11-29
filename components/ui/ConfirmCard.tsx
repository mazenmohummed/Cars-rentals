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
import { Calendar22 } from "../HeadBar/Calendar22";
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table"
import { User } from 'lucide-react';
import { Luggage } from 'lucide-react';
import { GiCarDoor } from "react-icons/gi";
import { TbLuggage } from "react-icons/tb";


interface IProps {
Name:string | undefined,
Comment:string | undefined,
ImgUrl: string | undefined,
Type: string | undefined,
DayPrice: number | undefined,
TotalPrice: number | undefined,
seats:number | undefined,
bags: number | undefined,
doors:number | undefined,
automatic:boolean | undefined,
}



export default function ConfirmCard ({ 
  Name,
  Type, 
  ImgUrl, 
  Comment, 
  DayPrice, 
  TotalPrice,
  seats,
  bags,
  doors,
  automatic, }: IProps ) {
  
  const [Mileage, setMileage] = useState<string | null>(null);
  console.log(Mileage)
  
  return (

    <div className="flex w-full md:w-5/6 xl:w-4/6  lg:w-5/6 mx-auto h-auto ">
      <Item variant="outline" className=" w-full flex h-auto">
        <div className="flex w-full  flex-wrap">

        <ItemContent className="m-2">

            <ItemTitle className="text-2xl">{Name}</ItemTitle>
            <ItemTitle className="text-2xl">{Type}</ItemTitle>
            <div>
                <Badge variant="outline"><User />{seats}</Badge>
            <Badge variant="outline"><TbLuggage />{bags}</Badge>
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
          <div className="flex items-end gap-2">
           {/* Daily price */}
             <div className="flex items-baseline gap-1">
               <span className="text-sm font-medium ">E£</span>
               <span className="text-3xl font-bold ">{DayPrice}</span>
               <span className="text-sm ">/day</span>
             </div>

             {/* Total price */}
             <span className="text-sm ">E£ {TotalPrice} total</span>

               

           </div>

        </ItemContent>
        <ItemContent className="m-2">
          <ItemTitle className="text-2xl mx-auto my-2 ">Date</ItemTitle>
          <div className="flex gap-5 h-auto flex-wrap mx-auto justify-center items-center">
                    <div>
                    <Label className="my-2"  htmlFor="CheckOutTitle">Check Out</Label>
                    <Label className="my-2"  htmlFor="CheckOut">Thu, 27. Nov, 2025 | 12:00</Label>
                    <Label className="mt-4"  htmlFor="PickupTitle">Pickup Station</Label>
                    <Label className="my-2"  htmlFor="Pickup">Hurghada</Label>
                    </div>
                    <div >
                    <Label className="my-2" htmlFor="CheckInTitle">Check In</Label>
                    <Label className="my-2"  htmlFor="DateFrom">Sun, 23. Nov, 2025 | 12:00</Label>
                    <Label className="mt-4"  htmlFor="ReturnTitle">Return Station</Label>
                    <Label className="my-2"  htmlFor="Return">Hurghada</Label>
                    </div>
          </div>
          <ItemTitle className="text-2xl mx-auto my-2 ">3 Rental Days</ItemTitle>
           <Table>
           <TableCaption>Rental includes Kms: 700,  Excess mileage 00.30 EUR</TableCaption>
           <TableHeader>
             <TableRow>
               <TableHead className="w-[100px]">Service</TableHead>
               <TableHead>Quantity</TableHead>
               <TableHead>Amount</TableHead>
               <TableHead className="text-right">Total Amount</TableHead>
             </TableRow>
           </TableHeader>
           <TableBody>
             <TableRow>
               <TableCell className="font-medium">Rental fee</TableCell>
               <TableCell>3</TableCell>
               <TableCell>100.00</TableCell>
               <TableCell className="text-right">300.00</TableCell>
             </TableRow>
             <TableRow>
               <TableCell className="font-medium">WiFi</TableCell>
               <TableCell>1</TableCell>
               <TableCell>20.00</TableCell>
               <TableCell className="text-right">20.00</TableCell>
             </TableRow>
             <TableFooter>
               <TableRow>
                 <TableCell colSpan={3}>Total</TableCell>
                 <TableCell className="text-right">320.00</TableCell>
               </TableRow>
             </TableFooter>
           </TableBody>
         </Table>
         <Button children="Confirm" className="w-4/6 mx-auto mt-2"/>
        </ItemContent>
      </div>
      </Item>
    </div>
  );
}
