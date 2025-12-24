// app/cars/[id]/services/page.tsx

import { prisma } from "@/lib/prisma";
import { ItemTitle } from "@/components/ui/item";
import ServicesList from "@/components/ui/services/ServicesList";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    from?: string;
    to?: string;
    pickup?: string;
    return?: string;
    mileage?: string;
  }>;
}

export default async function ServicesPage({ params, searchParams }: PageProps) {
  // Await both promises
  const { id } = await params;
  const sParams = await searchParams;

  // Get only active services from Prisma
  const services = await prisma.extraService.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" }
  });

  return (
    <main className="p-6 flex flex-col items-center w-full">
      <ItemTitle className="my-6 text-3xl">Available Services</ItemTitle>
      
      {services.length === 0 ? (
        <p className="text-muted-foreground">No extra services available at this time.</p>
      ) : (
        /* Pass sParams directly to the searchParams prop */
        <ServicesList 
          services={services} 
          carId={id} 
          searchParams={sParams} 
        />
      )}
    </main>
  );
}