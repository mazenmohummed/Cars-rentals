"use client";

import ConfirmCard from "@/components/ui/ConfirmCard"
import { cars } from "@/Data/cars";
import { useParams } from "next/navigation";

interface IProps {

}

const page = ({}: IProps) => {
  const params = useParams(); 
      const { id } = params;

       const carId = Number(id);

  const car = cars.find((c) => c.id === carId);

  return (
    <main className="p-6 flex justify-center">
      <div className="flex items-center justify-between px-6 w-full md:w-5/6 xl:w-5/6  lg:w-5/6 "> 
        <ConfirmCard Name={car?.Name} Comment={car?.Comment} DayPrice={car?.DayPrice} ImgUrl={car?.ImgUrl} TotalPrice={car?.TotalPrice} Type={car?.Type} />
    </div>
    </main>
  )
}

export default page