"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"; // Replace with your button
import { toast } from "react-hot-toast"; // optional for notifications
import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { z } from "zod";

// Zod schema
const mileagePlanSchema = z.object({
  carId: z.string().nonempty("Car ID is required"),
  type: z.enum(["LIMITED", "UNLIMITED"]),
  pricePerDay: z.number().min(0, "Price per day must be >= 0"),
  kmPerDay: z.number().min(0).optional(),
  extraKmPrice: z.number().min(0).optional(),
});

interface MileagePlanFormProps {
  carId: string;
}

export const AddMileagePlan: React.FC<MileagePlanFormProps> = ({ carId }) => {
  const [type, setType] = useState<"LIMITED" | "UNLIMITED">("LIMITED");
  const [pricePerDay, setPricePerDay] = useState<number>(0);
  const [kmPerDay, setKmPerDay] = useState<number | null>(null);
  const [extraKmPrice, setExtraKmPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Prepare data for validation
    const data = {
      carId,
      type,
      pricePerDay,
      kmPerDay: type === "LIMITED" ? kmPerDay : undefined,
      extraKmPrice: type === "LIMITED" ? extraKmPrice : undefined,
    };

    // Validate with Zod
    const result = mileagePlanSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field) fieldErrors[field as string] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error("Please fix the errors in the form");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/mileage-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) throw new Error("Failed to add mileage plan");

      toast.success("Mileage Plan added!");
      setPricePerDay(0);
      setKmPerDay(null);
      setExtraKmPrice(null);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form className="space-y-4 p-4 border rounded-md" onSubmit={handleSubmit}>
        <Select
          value={type}
          onValueChange={(value) =>
            setType(value as "LIMITED" | "UNLIMITED")
            
          }
        >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Mileage Plan" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Type</SelectLabel>
          <SelectItem value="LIMITED">LIMITED</SelectItem>
          <SelectItem value="UNLIMITED">UNLIMITED</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}

      <div>
        <label className="block font-medium mb-1">Price per Day</label>
        <input
          type="number"
          value={pricePerDay}
          onChange={(e) => setPricePerDay(Number(e.target.value))}
          className="border px-2 py-1 rounded-md w-full"
          min={0}
          required
        />
        {errors.pricePerDay && (
          <p className="text-red-500 text-sm">{errors.pricePerDay}</p>
        )}
      </div>

      {type === "LIMITED" && (
        <>
          <div>
            <label className="block font-medium mb-1">Km per Day</label>
            <input
              type="number"
              value={kmPerDay ?? ""}
              onChange={(e) => setKmPerDay(Number(e.target.value))}
              className="border px-2 py-1 rounded-md w-full"
              min={0}
              required
            />
            {errors.kmPerDay && (
              <p className="text-red-500 text-sm">{errors.kmPerDay}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Extra Km Price</label>
            <input
              type="number"
              value={extraKmPrice ?? ""}
              onChange={(e) => setExtraKmPrice(Number(e.target.value))}
              className="border px-2 py-1 rounded-md w-full"
              min={0}
              required
            />
             {errors.extraKmPrice && (
              <p className="text-red-500 text-sm">{errors.extraKmPrice}</p>
            )}
          </div>
        </>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Mileage Plan"}
      </Button>
    </form>
  );
};
