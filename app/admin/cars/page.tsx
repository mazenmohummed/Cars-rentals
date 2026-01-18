import AdminCars from "@/components/Main/AdminCars";
import { AddCar } from "@/components/Main/car/AddCar";
import { Button } from "@/components/ui/button";

import { requireAdmin } from "@/lib/auth"
import Link from "next/link";



export default async function CarPage({ params }: { params: { id: string } }) {
  await requireAdmin()
  const carId = Number(params.id);
  


  return (
    <main className="">
        <h1 className="flex justify-center items-center text-4xl mx-auto py-4">Manage Cars</h1> 

        
        
        <div className="flex flex-col lg:flex-row justify-center mx-auto my-4">
          <div className="flex flex-row py-2 lg:py-4">
          <Link href={`/admin/reservations`}>
          <Button className=" mx-6 w-40" children="Manage Reservation"/>
          </Link>
          <Link href={`/admin/unavailability`}>
          <Button className=" mx-6 w-40" children="Manage unavailability"/>
          </Link>
          </div>
          <div className="flex flex-row py-2 lg:py-4">
          <Link href={`/admin/cars/services`}>
          <Button className=" mx-6 w-40" children="Manage Services"/>
          </Link>
          <div className="mx-6 w-40">
          <AddCar  /> 
          </div>
          </div>
        </div>

    <div className="flex justify-center mt-10">
       
      < AdminCars />
    </div>
    </main>
  );
}
