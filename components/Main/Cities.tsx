import { prisma } from "@/lib/prisma";
import { CityCard } from "../ui/city/CityCard";

const Cities = async () => {
  // 1. Fetch data from Prisma
  const cities = await prisma.city.findMany({
    orderBy: {
      name: "asc", // Optional: Sort cities alphabetically
    },
  });

  return (
    <div className="mx-auto justify-center w-full py-6 px-2">
      <div className="flex justify-center mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-4xl">
          Our Cities
        </h2>
      </div>

      <div className="flex gap-4 justify-center py-6 flex-wrap">
        {/* 2. Map through the database results */}
        {cities.map((city) => (
          <CityCard
            key={city.id}
            Name={city.name}
            Comment={city.description}
            ImgUrl={city.image}
          />
        ))}

        {/* 3. Handle Empty State */}
        {cities.length === 0 && (
          <p className="text-muted-foreground text-center">No cities available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Cities;