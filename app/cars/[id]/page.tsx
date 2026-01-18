import { prisma } from "@/lib/prisma";
import ReserveCard from "@/components/Main/reservation/ReserveCard";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ 
    from?: string; 
    to?: string; 
    pickup?: string; 
    return?: string; 
  }>;
}

export default async function CarDetailsPage({ params, searchParams }: PageProps) {

  const { id } = await params;
  const sParams = await searchParams;

  const car = await prisma.car.findUnique({
    where: { id },
    include: { mileagePlans: true },
  });

  if (!car) {
    return <h1>Car not found 😔</h1>;
  }

  // Fetch transport fees for the selected cities
  let cityFees = 0;
  if (sParams.pickup || sParams.return) {
    const cities = await prisma.city.findMany({
      where: { id: { in: [sParams.pickup, sParams.return].filter(Boolean) as string[] } },
      select: { transFee: true }
    });
    cityFees = cities.reduce((acc, city) => acc + (city.transFee || 0), 0);
  }

  const unlimitedPlan = car.mileagePlans.find(p => p.type === "UNLIMITED");
  const limitedPlan = car.mileagePlans.find(p => p.type === "LIMITED");

  return (
    <ReserveCard
      Id={car.id}
      Name={car.name}
      Type={car.type}
      ImgUrl={car.mainImage}
      Comment={car.comment || ""}
      seats={car.seats ?? 0}
      bags={car.bags ?? 0}
      doors={car.doors ?? 0}
      automatic={car.gearbox ?? false}
      fromDate={sParams.from}
      toDate={sParams.to}
      cityFees={cityFees}
      unlimitedPrice={unlimitedPlan?.pricePerDay ?? null}
    limitedPrice={limitedPlan?.pricePerDay ?? null}
    MileageKM={limitedPlan?.kmPerDay ?? null}
    extraKmPrice={limitedPlan?.extraKmPrice ?? null}
    pickupCity={sParams.pickup}
    returnCity={sParams.return}
    />
  );
}
