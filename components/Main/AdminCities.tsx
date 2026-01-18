import { prisma } from "@/lib/prisma";
import { AdminCarCard } from "./car/AdminCarCard";
import { CityCard } from "./city/CityCard";
import { AdminCityCard } from "./city/AdminCitycard";
import Cities from "./Cities";

const AdminCities = async () => {
  // Fetch cars with related mileage plans
  const city = await prisma.city.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-wrap p-2 justify-center w-full gap-3">
       {city.map((city) => {

          return (
           <AdminCityCard 
           cityId={city.id}
           initialData={{
              id: city.id,
              name: city.name,
              description: city.description,
              image: city.image,
              transFee: city.transFee
            }}
            key={city.id}
             />
          );
})}
      </div>
    </div>
  );
};

export default AdminCities;
