"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import Link from "next/link";
import { User, Luggage, ShieldAlert } from 'lucide-react';
import { GiCarDoor } from "react-icons/gi";
import { differenceInDays, parseISO } from "date-fns";
import { toast } from "react-hot-toast"; // Recommended for showing the error

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
  Name, Type, ImgUrl, Comment, unlimitedPrice, limitedPrice, MileageKM,
  Id, seats, bags, doors, automatic, extraKmPrice, fromDate, toDate,
  cityFees, pickupCity, returnCity
}: IReserveCard) {
  
  const [Mileage, setMileage] = useState<string | null>(null);

  const rentalDays = (fromDate && toDate) 
    ? Math.max(differenceInDays(parseISO(toDate), parseISO(fromDate)), 1) 
    : 1;

  const currentDailyPrice = Mileage === "unlimited" ? (unlimitedPrice ?? 0) : (limitedPrice ?? 0);   
  const totalPrice = (currentDailyPrice * rentalDays) + cityFees;

  // VALIDATION FUNCTION
  const handleNextClick = (e: React.MouseEvent) => {
    if (!Mileage) {
      e.preventDefault(); // Stop navigation
      toast.error("Please select a mileage option to continue");
    }
  };

  return (
    <div className="flex py-4 w-full md:w-5/6 mx-auto h-auto px-2">
      <Item variant="outline" className="w-full flex h-auto overflow-hidden">
        <div className="flex w-full flex-col lg:flex-row">

          {/* LEFT SIDE: Car Details */}
          <ItemContent className="m-2 flex-1">
            <ItemTitle className="text-xl sm:text-2xl font-bold">{Name} <span className="text-muted-foreground font-normal">{Type}</span></ItemTitle>
            
            <div className="flex flex-wrap gap-2 my-2">
              <Badge variant="outline" className="gap-1"><User size={14}/>{seats}</Badge>
              <Badge variant="outline" className="gap-1"><Luggage size={14}/>{bags}</Badge>
              <Badge variant="outline" className="gap-1"><GiCarDoor size={14}/>{doors}</Badge>
              {automatic && <Badge>Automatic</Badge>}
            </div>

            <div className="relative mx-auto w-full py-4">
              <img src={ImgUrl} alt={Name} className="mx-auto" />
            </div>
          
            <ItemDescription className="mb-4">{Comment}</ItemDescription>
            
            <div className="flex flex-col sm:flex-row sm:items-end gap-2 border-t pt-4">
               <div className="flex items-baseline gap-1">
                 <span className="text-sm font-medium">€</span>
                 <span className="text-3xl font-bold">{currentDailyPrice}</span>
                 <span className="text-sm">/day</span>
               </div>
               <span className="text-sm text-muted-foreground">€ {totalPrice} total for {rentalDays} days</span>
            </div>
          </ItemContent>

          {/* RIGHT SIDE: Mileage Selection */}
          <ItemContent className="m-2 lg:m-auto border-t lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-6 flex-1">
            <ItemTitle className="text-xl mb-4">Select Mileage</ItemTitle>
            
            <div className="space-y-4">
              {/* Unlimited Option */}
              <Item 
                variant="outline" 
                className={`w-full cursor-pointer transition-all ${Mileage === "unlimited" ? "ring-2 ring-primary bg-primary/5" : ""}`}
                onClick={() => setMileage("unlimited")} 
              >
                <ItemContent className="p-3 min-w-[300px]">
                  <ItemTitle className="text-lg">Unlimited</ItemTitle>
                  <ItemDescription className="text-xs">All kilometers included</ItemDescription>
                </ItemContent>
              </Item>

              {/* Limited Option */}
              <Item 
                variant="outline" 
                className={`w-full cursor-pointer transition-all ${Mileage === `${MileageKM}` ? "ring-2 ring-primary bg-primary/5" : ""}`}
                onClick={() => setMileage(`${MileageKM}`)} 
              >
                <ItemContent className="p-3">
                  <ItemTitle className="text-lg">{MileageKM} KM</ItemTitle>
                  <ItemDescription className="text-xs">+€{extraKmPrice}/extra km</ItemDescription>
                </ItemContent>
              </Item>

              {/* Next Button with Validation */}
              <Link 
                href={`/cars/${Id}/services?from=${fromDate}&to=${toDate}&pickup=${pickupCity}&return=${returnCity}&mileage=${Mileage}`}
                onClick={handleNextClick}
                className="block"
              >
                <Button className={`w-full h-12 text-lg shadow-lg ${!Mileage ? "opacity-50 cursor-not-allowed" : "animate-pulse-subtle"}`}>
                  Next
                </Button>
              </Link>
              
              {!Mileage && (
                <p className="text-[10px] text-center text-red-500 flex items-center justify-center gap-1">
                  <ShieldAlert size={12} /> Please select an option to proceed
                </p>
              )}
            </div>
          </ItemContent>
        </div>
      </Item>
    </div>
  );
}