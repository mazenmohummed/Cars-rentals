import { CarCard } from "@/components/ui/car/CarCard"
import { prisma } from "@/lib/prisma";
import Link from "next/link"
import { differenceInDays, parseISO, startOfDay } from "date-fns";

interface CarsProps {
  searchParams: { 
    from?: string; 
    to?: string; 
    pickupCityId?: string; 
    returnCityId?: string; 
  };
}

const Cars = async ({ searchParams }: CarsProps) => {
  const { from, to, pickupCityId, returnCityId } = searchParams;

  // 1. Parse Dates safely
  const startDate = from ? startOfDay(parseISO(from)) : null;
  const endDate = to ? startOfDay(parseISO(to)) : null;
  
  // Calculate duration (minimum 1 day)
  const rentalDays = (startDate && endDate) 
    ? Math.max(differenceInDays(endDate, startDate), 1) 
    : 1;

  // 2. Fetch City Fees if cities are selected
  let cityFees = 0;
  if (pickupCityId || returnCityId) {
    const cities = await prisma.city.findMany({
      where: {
        id: { in: [pickupCityId || "", returnCityId || ""].filter(Boolean) }
      },
      select: { transFee: true }
    });
    cityFees = cities.reduce((acc, city) => acc + (city.transFee || 0), 0);
  }

  // 3. Fetch Available Cars
  const cars = await prisma.car.findMany({
    where: {
      isActive: true,
      NOT: {
        availability: {
          some: {
            AND: [
              { startDate: { lte: endDate || new Date() } },
              { endDate: { gte: startDate || new Date() } },
            ],
          },
        },
      },
    },
    include: {
      mileagePlans: true,
    },
  });

  return (
    <div className="flex justify-center w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full md:w-5/6 lg:w-5/6 xl:w-5/6">
        {cars.map((car) => {
          const limitedPlan = car.mileagePlans.find((p) => p.type === "LIMITED");
          const dailyPrice = limitedPlan?.pricePerDay ?? 0;
          
          // Total = (Daily Price * Days) + City Transport Fees
          const totalCalculation = (dailyPrice * rentalDays) + cityFees;

          return (
            <Link 
              key={car.id} 
              href={`/cars/${car.id}?from=${from}&to=${to}&pickup=${pickupCityId}&return=${returnCityId}`}
            >
              <CarCard
                Name={car.name}
                Type={car.type}
                ImgUrl={car.mainImage}
                Comment="" 
                DayPrice={dailyPrice}
                TotalPrice={totalCalculation}
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
  );
};

export default Cars;