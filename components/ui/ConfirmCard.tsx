"use client";

import { useAuth } from "@clerk/nextjs"; // 1. Import useAuth
import { toast } from "react-hot-toast";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "./button";
import { Item, ItemContent, ItemDescription, ItemTitle } from "./item";
import { Badge } from "./badge";
import { User, Luggage, Loader2 } from "lucide-react";
import { Label } from "./label";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableFooter, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "./table";
import { differenceInDays, parseISO } from "date-fns";
import { useState, useEffect } from "react";
import { GiCarDoor } from "react-icons/gi";
import Image from "next/image";

// Define a proper interface for the incoming props
interface ConfirmCardProps {
  reservationData: any; // The body you will send to the API
  Name: string;
  Type: string;
  ImgUrl: string;
  Comment: string;
  unlimitedPrice: number | null;
  limitedPrice: number | null;
  MileageKM: number | null;
  Id: string;
  seats: number;
  bags: number;
  doors: number;
  automatic: boolean;
  extraKmPrice: number | null;
  fromDate: string;
  toDate: string;
  cityFees: number;
  dayPrice: number;
  selectedServices: { name: string; price: number }[];
  returnStation: string;
  checkInDate: string; // usually same as toDate
  pickupStation: string;
  checkOutDate: string; // usually same as fromDate
  selectedMileageType: "unlimited" | "limited"; 
}

export default function ConfirmCard({
  reservationData,
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
  dayPrice,
  selectedServices,
  returnStation,
  checkInDate,
  pickupStation,
  checkOutDate,
  selectedMileageType
}: ConfirmCardProps) {
  const router = useRouter();
  const pathname = usePathname(); // Get current path
  const searchParams = useSearchParams(); // Get current query strings
  const { userId } = useAuth(); // 3. Get userId
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Calculate Days
  const rentalDays = (fromDate && toDate)
    ? Math.max(differenceInDays(parseISO(toDate), parseISO(fromDate)), 1)
    : 1;

  // 2. Determine displayed price based on the plan chosen in previous steps
  const currentDailyPrice = selectedMileageType === "unlimited" ? (unlimitedPrice ?? 0) : (limitedPrice ?? 0);

  // 3. Totals Calculation
  const rentalTotal = rentalDays * dayPrice;
  const servicesTotal = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const grandTotal = rentalTotal + servicesTotal + cityFees;
  const KmTotal = (MileageKM ?? 0) * rentalDays;

  const handleConfirm = async () => {
    // 4. Check if user is logged in
    if (!userId) {
      
      // Construct the current URL to return to after login
      const currentUrl = `${pathname}?${searchParams.toString()}`;
      
      // Redirect to Clerk sign-up with a redirect_url parameter
      router.push(`/sign-up?redirect_url=${encodeURIComponent(currentUrl)}`);
      return;
    }



    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...reservationData,
          totalPrice: grandTotal 
        }),
      });

      if (!res.ok) throw new Error("Failed to book");

      toast.success("Reservation Successful!");
      router.push("/profile/reservations");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full md:w-5/6 xl:w-4/6 lg:w-5/6 mx-auto h-auto">
      <Item variant="outline" className="w-full flex h-auto">
        <div className="flex w-full flex-wrap">
          <ItemContent className="m-2">
            <ItemTitle className="text-2xl">{Name}</ItemTitle>
            <ItemTitle className="text-xl text-muted-foreground">{Type}</ItemTitle>
            <div className="flex gap-2 my-2">
              <Badge variant="outline"><User className="w-4 h-4 mr-1" />{seats}</Badge>
              <Badge variant="outline"><Luggage className="w-4 h-4 mr-1" />{bags}</Badge>
              <Badge variant="outline"><GiCarDoor className="w-4 h-4 mr-1" />{doors}</Badge>
              {automatic && <Badge>Automatic</Badge>}
            </div>
        
            <div className="relative w-full aspect-video sm:aspect-[16/9] lg:aspect-auto lg:h-64 overflow-hidden rounded-lg">
              <Image
                src={ImgUrl}
                alt={Name} 
                fill 
                 priority 
                className="object-contain " // Changed from object-cover to contain to ensure the whole car is visible
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <ItemDescription>{Comment}</ItemDescription>
            <div className="flex flex-col mt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-medium">E£</span>
                <span className="text-3xl font-bold">{currentDailyPrice}</span>
                <span className="text-sm">/day</span>
              </div>
            </div>
          </ItemContent>

          <ItemContent className="m-2 mx-auto  flex-1">
            <ItemTitle className="text-2xl my-2">Booking Summary</ItemTitle>
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-muted rounded-lg">
              <div>
                <Label className="text-muted-foreground">Pick Up</Label>
                <p className="font-semibold">{checkOutDate}</p>
                <p className="text-sm">{pickupStation}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Return</Label>
                <p className="font-semibold">{checkInDate}</p>
                <p className="text-sm">{returnStation}</p>
              </div>
            </div>

            <Table>
              <TableCaption>
                Plan: {selectedMileageType.toUpperCase()}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Rental Fee </TableCell>
                  <TableCell>{rentalDays}</TableCell>
                  <TableCell className="text-right">€ {rentalTotal.toFixed(2)}</TableCell>
                </TableRow>
                {cityFees > 0 && (
                  <TableRow>
                    <TableCell>Transport Fees</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell className="text-right">€ {cityFees.toFixed(2)}</TableCell>
                  </TableRow>
                )}
                {selectedServices.map((service, index) => (
                  <TableRow key={index}>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell className="text-right">€ {service.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2} className="text-lg font-bold">Total Amount</TableCell>
                  <TableCell className="text-right text-lg font-bold text-primary">
                    € {grandTotal.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
           {selectedMileageType === "limited" && MileageKM && (
              <ItemDescription>
                Price for every km above {KmTotal} Km is € {(extraKmPrice?? 0).toFixed(2)} 
              </ItemDescription>
            )}

                 <Button 
                onClick={handleConfirm} 
                disabled={isSubmitting}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white"
              >
                {isSubmitting ? (
    <div className="flex items-center justify-center gap-2">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span>Finalizing Booking...</span>
    </div>
  ) : (
    <span>
      {userId ? "Confirm Reservation" : "Sign up to Reserve"}
    </span>
  )}
              </Button>
          </ItemContent>
        </div>
      </Item>
    </div>
  );
}