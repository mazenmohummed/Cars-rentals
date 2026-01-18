import { prisma } from "@/lib/prisma";
import ConfirmCard from "@/components/Main/ConfirmCard";
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

  const { 
    from, to, pickup, return: returnCity, 
    mileage, selectedServices, telephone, 
    street, city, status, zip, flightNumber 
  } = sParams;

  const car = await prisma.car.findUnique({
    where: { id },
    include: { mileagePlans: true }
  });

  if (!car) return <div className="p-20 text-center">Car not found</div>;

  // 1. IMPROVED PLAN SELECTION (Case Insensitive)
  const normalizedMileage = mileage?.toUpperCase(); // "unlimited" -> "UNLIMITED"
  
  const selectedPlan = car.mileagePlans.find(p => p.type === normalizedMileage) 
                       || car.mileagePlans[0]; // Fallback to first plan if none match

  const unlimitedPlan = car.mileagePlans.find(p => p.type === "UNLIMITED");
  const limitedPlan = car.mileagePlans.find(p => p.type === "LIMITED");

  // 2. SAFETY CHECK: If no plans exist at all for this car
  if (!selectedPlan) {
    return <div className="p-20 text-center">No pricing plans available for this vehicle.</div>;
  }

  const services = await prisma.extraService.findMany({
    where: { id: { in: selectedServices?.split(",").filter(Boolean) || [] } }
  });

  const cities = await prisma.city.findMany({
    where: { id: { in: [pickup, returnCity].filter(Boolean) as string[] } }
  });

  const pickupObj = cities.find(c => c.id === pickup);
  const returnObj = cities.find(c => c.id === returnCity);
  
  const days = Math.max(differenceInDays(parseISO(to || ""), parseISO(from || "")), 1);

  const cityFees = (pickupObj?.transFee || 0) + (returnObj?.transFee || 0);
  const servicesTotal = services.reduce((acc, s) => acc + s.price, 0);

  // 3. SAFE CALCULATION (Removed the ! crashes)
  const finalPrice = (selectedPlan.pricePerDay * days) + cityFees + servicesTotal;

  const reservationData = {
    carId: id,
    pickupCityId: pickup,
    returnCityId: returnCity,
    mileagePlanId: selectedPlan.id,
    startDate: from,
    endDate: to,
    totalPrice: finalPrice,
    telephone,
    flightNumber,
    address: { street, city, status, zip },
    services: services.map(s => ({ id: s.id, price: s.price })),
  };

  return (
    <main className="p-6 flex flex-col items-center w-full">
      <ConfirmCard 
        Name={car.name}
        Type={car.type}
        ImgUrl={car.mainImage}
        Comment={car.comment||""}
        Id={car.id}
        seats={car.seats ?? 0}
        bags={car.bags ?? 0}
        doors={car.doors ?? 0}
        automatic={car.gearbox ?? false}
        dayPrice={selectedPlan.pricePerDay}
        unlimitedPrice={unlimitedPlan?.pricePerDay ?? null}
        limitedPrice={limitedPlan?.pricePerDay ?? null}
        MileageKM={limitedPlan?.kmPerDay ?? null}
        extraKmPrice={limitedPlan?.extraKmPrice ?? null}
        selectedMileageType={mileage === "unlimited" ? "unlimited" : "limited"}
        fromDate={from || ""} 
        toDate={to || ""}
        checkInDate={to || ""}
        checkOutDate={from || ""}
        pickupStation={pickupObj?.name || "Standard Pickup"}
        returnStation={returnObj?.name || "Standard Return"}
        cityFees={cityFees}
        selectedServices={services.map(s => ({ name: s.name, price: s.price }))}
        reservationData={reservationData}
      />
    </main>
  );
}