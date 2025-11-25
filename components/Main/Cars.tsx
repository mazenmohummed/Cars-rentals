import {CarCard} from "@/components/ui/CarCard"
import { cars } from "@/Data/cars";
import Link from "next/link"

const Cars = () => {
  return (
    <div className=" flex pt-[6] justify-center ">
      <div className="flex flex-wrap p-2 justify-center w-full md:w-5/6  lg:w-5/6 xl:w-5/6 gap-3  " > 
       {cars.map((car) => (
        <Link key={car.id} href={`/cars/${car.id}`}>
          <CarCard 
            Name={car.Name}
            Type={car.Type}
            ImgUrl={car.ImgUrl}
            Comment={car.Comment}
            DayPrice={car.DayPrice}
            TotalPrice={car.TotalPrice}
          />
        </Link>
      ))}
      </div>
    </div>
  )
}

export default Cars