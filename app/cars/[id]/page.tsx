"use clint"

import { cars } from "@/Data/cars";
import ReserveCard from "@/components/ui/ReserveCard";

interface IProps {
  params: {
     id: string 
    } 
}


export default async function CarDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ⬅️ THIS IS NOW VALID
  const carId = Number(id);

  const car = cars.find((c) => c.id === carId);

  if (!car) {
    return <h1 className="p-6 text-xl">Car not found 😔</h1>;
  }

  return (
    <main className="p-6 flex justify-center">
      <div className="flex items-center justify-between px-6 w-full md:w-5/6 xl:w-5/6  lg:w-5/6 ">
      <ReserveCard Id={id} {...car} />
      </div>
    </main>
  );
}

