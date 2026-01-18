"use client";

import { useState, useTransition } from "react"; // Added useTransition
import ServiceCard from "./ServiceCard";
import { Button } from "@/components/ui/button";
import { Wifi, User, Fuel, Baby, Loader2 } from "lucide-react"; // Added Loader2
import { useRouter } from "next/navigation"; // Use router for navigation control
import { FaPlus } from "react-icons/fa";

// Helper to map icons based on name
const getIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("wifi")) return <Wifi />;
  if (n.includes("driver")) return <User />;
  if (n.includes("fuel")) return <Fuel />;
  if (n.includes("baby") || n.includes("seat")) return <Baby />;
  return <FaPlus />;
};

interface ServicesListProps {
  services: any[];
  carId: string;
  searchParams: {
    from?: string;
    to?: string;
    pickup?: string;
    return?: string;
    mileage?: string;
  };
}

export default function ServicesList({ services, carId, searchParams }: ServicesListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition(); // Initialize transition state
  const router = useRouter();

  // Destructure from the searchParams prop
  const { from, to, pickup, return: returnCity, mileage } = searchParams;

  const toggleService = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Handle the navigation with loading state
  const handleNext = () => {
    startTransition(() => {
      const query = new URLSearchParams({
        from: from || "",
        to: to || "",
        pickup: pickup || "",
        return: returnCity || "",
        mileage: mileage || "",
        selectedServices: selectedIds.join(","),
      });

      router.push(`/cars/${carId}/services/personalDetails?${query.toString()}`);
    });
  };

  return (
    <div className="flex flex-col mx-auto items-center w-full md:w-5/6 lg:w-4/6">
      <div className={`w-full transition-opacity duration-300 ${isPending ? "opacity-50 pointer-events-none" : ""}`}>
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            id={service.id}
            Name={service.name}
            price={service.price}
            description={service.description || "Cost you additional fee per reservation"}
            Icon={getIcon(service.name)}
            isSelected={selectedIds.includes(service.id)}
            onToggle={toggleService}
          />
        ))}
      </div>

      <Button 
        className="w-40 my-6 shadow-lg" 
        onClick={handleNext}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          "Next"
        )}
      </Button>
    </div>
  );
}