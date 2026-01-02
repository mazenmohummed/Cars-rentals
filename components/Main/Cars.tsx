import { CarCard } from "@/components/ui/car/CarCard"
import { prisma } from "@/lib/prisma";
import Link from "next/link"
import { differenceInDays, parseISO, startOfDay } from "date-fns";
import { SearchX, PhoneCall } from "lucide-react"; // Icons for the empty state
import { Button } from "@/components/ui/button";

export interface CarsProps {
  searchParams: { 
    from?: string; 
    to?: string; 
    pickupCityId?: string; 
    returnCityId?: string; 
  };
}

const Cars = async ({ searchParams }: CarsProps) => {
  const { from, to, pickupCityId, returnCityId } = searchParams;

  const startDate = from ? startOfDay(parseISO(from)) : null;
  const endDate = to ? startOfDay(parseISO(to)) : null;
  
  const rentalDays = (startDate && endDate) 
    ? Math.max(differenceInDays(endDate, startDate), 1) 
    : 1;

  let totalCityFees = 0;

  if (pickupCityId || returnCityId) {
    const selectedCities = await prisma.city.findMany({
      where: {
        id: { in: [pickupCityId, returnCityId].filter((id): id is string => !!id) }
      },
      select: { id: true, transFee: true }
    });

    const pickupFee = selectedCities.find(c => c.id === pickupCityId)?.transFee || 0;
    const returnFee = selectedCities.find(c => c.id === returnCityId)?.transFee || 0;
    totalCityFees = pickupFee + returnFee;
  }

  const cars = await prisma.car.findMany({
    where: {
      isActive: true,
      AND: [
        {
          availability: {
            none: {
              AND: [
                { startDate: { lte: endDate || new Date() } },
                { endDate: { gte: startDate || new Date() } },
              ],
            },
          },
        },
        {
          reservations: {
            none: {
              AND: [
                { status: { not: "CANCELLED" } },
                { startDate: { lte: endDate || new Date() } },
                { endDate: { gte: startDate || new Date() } },
              ],
            },
          },
        },
      ],
    },
    include: {
      mileagePlans: true,
    },
  });

  // --- EMPTY STATE START ---
  if (cars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-6 w-full">
        <div className="bg-muted p-6 rounded-full">
          <SearchX className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">No cars available</h2>
          <p className="text-muted-foreground max-w-[400px]">
            We couldn't find any available vehicles for your selected dates or locations. 
            Please try different dates or contact us directly for special requests.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
           <Link className="flex items-center " 
           href="https://wa.me/qr/QOO46YVL7TW5G1"  
           target="_blank"
           rel="noopener noreferrer"
           >
            <Button variant="default" className="gap-2 w-full sm:w-auto">
              <PhoneCall size={18} />
              Contact for Support
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              Modify Search
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  // --- EMPTY STATE END ---

  return (
    <div className="flex justify-center w-full px-2">
      {/* Grid container is usually better than flex-wrap for alignment on phones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
        {cars.map((car) => {
          const limitedPlan = car.mileagePlans.find((p) => p.type === "LIMITED");
          const dailyPrice = limitedPlan?.pricePerDay ?? 0;
          const totalCalculation = (dailyPrice * rentalDays) + totalCityFees;

          return (
            <Link 
              key={car.id} 
              href={`/cars/${car.id}?from=${from}&to=${to}&pickup=${pickupCityId}&return=${returnCityId}`}
              className="block transition-transform hover:scale-[1.02]"
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