"use client";

import React, { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import Link from "next/link";
import { User, Luggage, ShieldAlert, Loader2 } from 'lucide-react';
import { GiCarDoor } from "react-icons/gi";
import { differenceInDays, parseISO } from "date-fns";
import { toast } from "react-hot-toast"; // Recommended for showing the error
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  
  const router = useRouter();
  const [Mileage, setMileage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
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
    startTransition(() => {
      const url = `/cars/${Id}/services?from=${fromDate}&to=${toDate}&pickup=${pickupCity}&return=${returnCity}&mileage=${Mileage === "unlimited" ? "unlimited" : "limited"}`;
      router.push(url);
    });
  };

  return (
    <div className="flex py-4 w-full  md:w-5/6 mx-auto h-auto px-2">
      <Item variant="outline" className="w-full flex h-auto shadow-sm bg-primary mt-8 mx-auto overflow-hidden">
        <div className="flex w-full flex-col lg:flex-row">

          {/* LEFT SIDE: Car Details */}
          <ItemContent className="m-2 flex-1">
            <ItemTitle className="text-xl sm:text-2xl text-white font-bold">{Name} <span className="text-white/60 font-normal">{Type}</span></ItemTitle>
            
            <div className="flex flex-wrap gap-2 my-2">
              <Badge variant="outline" className="gap-1 bg-background"><User size={14}/>{seats}</Badge>
              <Badge variant="outline" className="gap-1 bg-background"><Luggage size={14}/>{bags}</Badge>
              <Badge variant="outline" className="gap-1 bg-background"><GiCarDoor size={14}/>{doors}</Badge>
              {automatic && <Badge className="bg-background text-foreground">Automatic</Badge>}
            </div>

            <div className="relative w-full aspect-video rounded-md sm:aspect-[16/9] lg:aspect-auto lg:h-64 overflow-hidden ">
              <Image
                src={ImgUrl}
                alt={Name} 
                fill 
                priority 
                className="object-contain " // Changed from object-cover to contain to ensure the whole car is visible
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          
            <ItemDescription className="mb-4 text-white">{Comment}</ItemDescription>
            
            <div className="flex flex-col text-white sm:flex-row sm:items-end gap-2 border-t pt-4">
               <div className="flex items-baseline gap-1">
                 <span className="text-sm font-medium">€</span>
                 <span className="text-3xl font-bold">{currentDailyPrice}</span>
                 <span className="text-sm">/day</span>
               </div>
               <span className="text-sm text-white/60">€ {totalPrice} total for {rentalDays} days</span>
            </div>
          </ItemContent>

          {/* RIGHT SIDE: Mileage Selection */}
          <ItemContent className="m-2 lg:m-auto border-t lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-6 flex-1">
            <ItemTitle className="text-xl text-white mb-4">Select Mileage</ItemTitle>
            
            <div className="space-y-4">
              {/* Unlimited Option */}
              <button 
                disabled={isPending}
                className={`w-full text-left rounded-lg bg-background border p-3 transition-all ${Mileage === "unlimited" ? "ring-2 ring-secondary bg-primary-foreground border-primary" : "border-input"} ${isPending ? "cursor-not-allowed" : ""}`}
                onClick={() => setMileage("unlimited")} 
              >
                <div className="font-semibold text-lg">Unlimited</div>
                <div className="text-xs text-foreground/60">All kilometers included</div>
              </button>

              {/* Limited Option */}
              <button 
                disabled={isPending}
                className={`w-full text-left rounded-lg bg-background border p-3 transition-all ${Mileage === "limited" ? "ring-2 ring-secondary bg-primary-foreground border-primary" : "border-input"} ${isPending ? "cursor-not-allowed" : ""}`}
                onClick={() => setMileage("limited")} 
              >
                <div className="font-semibold text-lg">{MileageKM} KM</div>
                <div className="text-xs text-foreground/60">+€{extraKmPrice}/extra km</div>
              </button>

              {/* Next Button with Loading Spinner */}
              <Button 
                onClick={handleNextClick}
                disabled={!Mileage || isPending}
                className="w-full h-12 text-lg bg-secondary text-foreground hover:bg-button-hover shadow-lg relative"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Calculating...
                  </div>
                ) : (
                  "Next"
                )}
              </Button>
              
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