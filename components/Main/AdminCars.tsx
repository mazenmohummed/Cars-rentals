import { prisma } from "@/lib/prisma";
import { AdminCarCard } from "./car/AdminCarCard";

const AdminCars = async () => {
  // Fetch cars with related mileage plans
  const cars = await prisma.car.findMany({
    orderBy: { createdAt: "desc" },
    include: { mileagePlans: true }, // fetch related mileage plans
  });

  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-wrap justify-center items-center gap-6 w-full ">
        {cars.map((car) => {
          const limitedPlan = car.mileagePlans.find(
            (plan) => plan.type === "LIMITED"
          );
          const unlimitedPlan = car.mileagePlans.find(p => p.type === "UNLIMITED");

          return (
            <AdminCarCard
              limitedPrice={limitedPlan?.pricePerDay ?? 0}
              unlimitedPrice={unlimitedPlan?.pricePerDay ?? 0}
              mileageInitialData={limitedPlan || unlimitedPlan || undefined}
              carInitialData={car}
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
