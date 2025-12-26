"use client";

import { useState } from "react";
import ServiceCard from "./ServiceCard";
import { Button } from "@/components/ui/button";
import { Wifi, User, Fuel, Baby } from "lucide-react";
import Link from "next/link";
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

  // Destructure from the searchParams prop
  const { from, to, pickup, return: returnCity, mileage } = searchParams;

  const toggleService = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col items-center w-full md:w-5/6 lg:w-4/6">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          id={service.id}
          Name={service.name}
          price={service.price}
          description={service.description || "Cost you addtional fee per reservation"}
          Icon={getIcon(service.name)}
          isSelected={selectedIds.includes(service.id)}
          onToggle={toggleService}
        />
      ))}

      <Link
        className="mx-auto my-6"
        href={{
          pathname: `/cars/${carId}/services/personalDetails`, // Pointing to the next step
          query: { 
            from, 
            to, 
            pickup, 
            return: returnCity, 
            mileage,
            selectedServices: selectedIds.join(",") 
          },
        }}
      >
        <Button className="w-40" disabled={selectedIds.length === 0 && services.length > 0}>
          Next
        </Button>
      </Link>
    </div>
  );
}