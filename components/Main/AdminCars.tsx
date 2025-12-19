import { prisma } from "@/lib/prisma";
import { AdminCarCard } from "../ui/AdminCarCard";

const AdminCars = async () => {
  // Fetch cars with related mileage plans
  const cars = await prisma.car.findMany({
    orderBy: { createdAt: "desc" },
    include: { mileagePlans: true }, // fetch related mileage plans
  });

  return (
    <div className="flex pt-[6] justify-center">
      <div className="flex flex-wrap p-2 justify-center w-full md:w-5/6 lg:w-5/6 xl:w-5/6 gap-3">
        {cars.map((car) => {
          const limitedPlan = car.mileagePlans.find(
            (plan) => plan.type === "LIMITED"
          );

          return (
            <AdminCarCard
              key={car.id}
              carId={car.id}
              Name={car.name}
              Type={car.type}
              ImgUrl={car.mainImage}
              Comment={""} // add comment if exists
              DayPrice={limitedPlan?.pricePerDay ?? 0} // <-- LIMITED plan price
              TotalPrice={limitedPlan?.pricePerDay ?? 0} // optional
              automatic={car.gearbox ?? false}
              bags={car.bags ?? 0}
              doors={car.doors ?? 0}
              seats={car.seats ?? 0}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AdminCars;
