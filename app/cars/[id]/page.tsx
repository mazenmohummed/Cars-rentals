import { prisma } from "@/lib/prisma";
import ReserveCard from "@/components/ui/ReserveCard";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function CarDetailsPage({ params }: PageProps) {

  
  console.log("PARAMS:", params); // ← TEMP DEBUG

  const { id } = await params;

  const car = await prisma.car.findUnique({
    where: { id },
    include: { mileagePlans: true },
  });

  if (!car) {
    return <h1>Car not found 😔</h1>;
  }

  const unlimitedPlan = car.mileagePlans.find(p => p.type === "UNLIMITED");
  const limitedPlan = car.mileagePlans.find(p => p.type === "LIMITED");

  return (
    <ReserveCard
      Id={car.id}
      Name={car.name}
      Type={car.type}
      ImgUrl={car.mainImage}
      Comment="Comfortable & reliable car"
      seats={car.seats ?? 0}
      bags={car.bags ?? 0}
      doors={car.doors ?? 0}
      automatic={car.gearbox ?? false}
      // DayPrice={
      //   car.mileagePlans.find(p => p.type === "UNLIMITED")?.pricePerDay ?? 0
      // }
      unlimitedPrice={unlimitedPlan?.pricePerDay ?? null}
    limitedPrice={limitedPlan?.pricePerDay ?? null}
    MileageKM={limitedPlan?.kmPerDay ?? null}
    extraKmPrice={limitedPlan?.extraKmPrice ?? null}
    />
  );
}
