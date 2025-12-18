import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AdminCarCard } from "../ui/AdminCarCard";

const AdminCars = async () => {
  // Fetch cars from the database
  const cars = await prisma.car.findMany({
    orderBy: { createdAt: "desc" }, // optional
  });

  return (
    <div className="flex pt-[6] justify-center">
      <div className="flex flex-wrap p-2 justify-center w-full md:w-5/6 lg:w-5/6 xl:w-5/6 gap-3">
        {cars.map((car) => (
          <Link key={car.id} href={`/cars/${car.id}`}>
            <AdminCarCard
              Name={car.name}
              Type={car.type}
              ImgUrl={car.mainImage}
              Comment={""} // add comment if exists
              DayPrice={0} // replace with actual field if exists
              TotalPrice={0} // replace with actual field if exists
              automatic={car.gearbox ?? false}
              bags={car.bags ?? 0}
              doors={car.doors ?? 0}
              seats={car.seats ?? 0}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminCars;
