import { prisma } from "@/lib/prisma";
import ConfirmCard from "@/components/ui/ConfirmCard";
import { parseISO, differenceInDays } from "date-fns";

export default async function ConfirmationPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ id: string }>, 
  searchParams: Promise<{ [key: string]: string | undefined }> 
}) {
  const { id } = await params;
  const sParams = await searchParams;

  // 1. Extract data from URL
  const { 
    from, to, pickup, return: returnCity, 
    mileage: mileage, selectedServices, telephone, 
    street, city, status, zip, flight 
  } = sParams;

  // 2. Fetch required DB objects
  const car = await prisma.car.findUnique({
    where: { id },
    include: { mileagePlans: true }
  });

  const services = await prisma.extraService.findMany({
    where: { id: { in: selectedServices?.split(",") || [] } }
  });

  const cities = await prisma.city.findMany({
    where: { id: { in: [pickup!, returnCity!].filter(Boolean) } }
  });

  if (!car) return <div>Car not found</div>;

  // 3. Helper Logic for display and calculations
  const pickupObj = cities.find(c => c.id === pickup);
  const returnObj = cities.find(c => c.id === returnCity);
  
  const days = Math.max(differenceInDays(parseISO(to!), parseISO(from!)), 1);
  const selectedPlan = car.mileagePlans.find(p => 
    p.type === (mileage === "unlimited" ? "UNLIMITED" : "LIMITED")
  );

  const unlimitedPlan = car.mileagePlans.find(p => p.type === "UNLIMITED");
  const limitedPlan = car.mileagePlans.find(p => p.type === "LIMITED");

  const cityFees = (pickupObj?.transFee || 0) + (returnObj?.transFee || 0);
  const servicesTotal = services.reduce((acc, s) => acc + s.price, 0);
  const finalPrice = (selectedPlan!.pricePerDay * days) + cityFees + servicesTotal;

  // 4. Prepare data for the API POST
  const reservationData = {
    carId: id,
    pickupCityId: pickup,
    returnCityId: returnCity,
    mileagePlanId: selectedPlan!.id,
    startDate: from,
    endDate: to,
    totalPrice: finalPrice,
    telephone,
    flightNumber: flight,
    address: { street, city, status, zip },
    services: services.map(s => ({ id: s.id, price: s.price })),
  };

  return (
    <main className="p-6 flex flex-col items-center w-full">
      <ConfirmCard 
        Name={car.name}
        Type={car.type}
        ImgUrl={car.mainImage}
        Comment="Reliable and comfortable vehicle for your trip."
        Id={car.id}
        seats={car.seats ?? 0}
        bags={car.bags ?? 0}
        doors={car.doors ?? 0}
        automatic={car.gearbox ?? false}
        
        // Prices & Plans
        dayPrice={selectedPlan!.pricePerDay}
        unlimitedPrice={unlimitedPlan?.pricePerDay ?? null}
        limitedPrice={limitedPlan?.pricePerDay ?? null}
        MileageKM={limitedPlan?.kmPerDay ?? null}
        extraKmPrice={limitedPlan?.extraKmPrice ?? null}
        selectedMileageType={mileage === "unlimited" ? "unlimited" : "limited"}
        
        // Dates & Locations
        fromDate={from || ""} 
        toDate={to || ""}
        checkInDate={to!}      // Display string for the UI
        checkOutDate={from!}   // Display string for the UI
        pickupStation={pickupObj?.name || "Standard Pickup"}
        returnStation={returnObj?.name || "Standard Return"}
        cityFees={cityFees}
        
        // Services & API Data
        selectedServices={services.map(s => ({ name: s.name, price: s.price }))}
        reservationData={reservationData}
      />
    </main>
  );
}