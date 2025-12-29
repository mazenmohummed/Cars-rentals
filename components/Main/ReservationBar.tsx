import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CityPicker } from "@/components/HeadBar/CityPicker"
import { Fragment } from "react/jsx-runtime"
import {  CarSearchForm } from "@/components/HeadBar/CarSearchForm"
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export async function ReservationBar() {
  // Fetch cities from database
  const citiesDb = await prisma.city.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: "asc" }
  });

  // Format them for the CityPicker (value/label)
  const formattedCities = citiesDb.map(city => ({
    value: city.id,
    label: city.name
  }));


  return (
      <div className="flex w-full items-center justify-between"> 
       <div className=" mx-auto w-full  ">
        
    <div className="px-2 w-full mx-auto mt-12 h-auto md:w-5/6 xl:w-5/6  lg:w-5/6">

          <div className="flex gap-5 h-auto flex-wrap mx-auto justify-center items-center">
          <CarSearchForm cities={formattedCities} />
          </div> 
          
    
    </div>
       </div>
       </div>
      )
}