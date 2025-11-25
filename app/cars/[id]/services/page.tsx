"use client";

import { Button } from "@/components/ui/button";
import { ItemTitle } from "@/components/ui/item";
import ServiceCard from "@/components/ui/ServiceCard"
import { Wifi } from 'lucide-react';
import { User } from 'lucide-react';
import { Fuel } from 'lucide-react';
import { Baby } from 'lucide-react';
import Link from "next/link";
import { useParams } from "next/navigation";


const page = () => {
    const params = useParams(); 
  const { id } = params;
  return (
     <main className="p-6 flex justify-center w-full">
          <div className="flex flex-wrap items-center justify-between px-6 w-full md:w-5/6 xl:w-5/6  lg:w-5/6 ">
          <ItemTitle className=" mx-auto my-6 text-3xl">Services</ItemTitle>
          <ServiceCard Icon={<Wifi />} Name="WiFi Hotspot" description="+EGP 18.88 / for every additional km"/>
          <ServiceCard Icon={<User/>} Name="Additional driver" description="+EGP 18.88 / for every additional km"/>
          <ServiceCard Icon={<Fuel/>} Name="Prepaid Fuel" description="+EGP 18.88 / for every additional km"/>
          <ServiceCard Icon={<Baby/>} Name="Baby seat" description="+EGP 18.88 / for every additional km"/>
          <Link className="mx-auto my-6" href={`/cars/${id}/services/personalDetails`}>
          <Button className=" mx-auto w-40" children="Next "/>
          </Link>

          </div>
        </main>
  )
}

export default page