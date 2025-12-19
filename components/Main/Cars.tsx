import {CarCard} from "@/components/ui/CarCard"
import { prisma } from "@/lib/prisma";
import Link from "next/link"

const Cars = async () => {
  // Fetch cars from the database
  const cars = await prisma.car.findMany({
    orderBy: { createdAt: "desc" }, // optional
    include: {
      mileagePlans: true, 
    },
  });

  return (
    <div className=" flex pt-[6] justify-center ">
      <div className="flex flex-wrap p-2 justify-center w-full md:w-5/6  lg:w-5/6 xl:w-5/6 gap-3  " > 
       {cars.map((car) => {
        const limitedPlan = car.mileagePlans.find(
            (plan) => plan.type === "LIMITED"
          );
          return(
        <Link key={car.id} href={`/cars/${car.id}`}>
          <CarCard 
              Name={car.name}
              Type={car.type}
              ImgUrl={car.mainImage}
              Comment={""} // add comment if exists
              DayPrice={limitedPlan?.pricePerDay ?? 0} // replace with actual field if exists
              TotalPrice={limitedPlan?.pricePerDay ?? 0} // replace with actual field if exists
              automatic={car.gearbox ?? false}
              bags={car.bags ?? 0}
              doors={car.doors ?? 0}
              seats={car.seats ?? 0}
          />
        </Link>
       );
})}
      </div>
    </div>
  )
}

export default Cars;