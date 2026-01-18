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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "../../ui/scroll-area";
import { useRouter } from "next/navigation";



// Zod schema



export const mileagePlanSchema = z
  .object({
    carId: z.string().min(1, "Car ID is required"),

    type: z.enum(["LIMITED", "UNLIMITED"], {
      message: "Mileage plan type is required",
    }),

    pricePerDay: z
      .number()
      .min(1, "Price per day must be greater than 0"),

    kmPerDay: z.number().optional(),

    extraKmPrice: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "LIMITED") {
      if (data.kmPerDay == null || Number.isNaN(data.kmPerDay)) {
        ctx.addIssue({
          path: ["kmPerDay"],
          message: "Km per day is required for LIMITED plan",
          code: "custom",
        });
      }

      if (data.extraKmPrice == null || Number.isNaN(data.extraKmPrice)) {
        ctx.addIssue({
          path: ["extraKmPrice"],
          message: "Extra km price is required for LIMITED plan",
          code: "custom",
        });
      }
    }
  });



interface MileagePlanFormProps {
  carId: string;
}

export const AddMileagePlan: React.FC<MileagePlanFormProps> = ({ carId }) => {
  const [type, setType] = useState<"LIMITED" | "UNLIMITED">("LIMITED");
  const [pricePerDay, setPricePerDay] = useState<number | "">("");
  const [kmPerDay, setKmPerDay] = useState<number | null>(null);
  const [extraKmPrice, setExtraKmPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [open, setOpen] = useState(false);

   const router = useRouter();

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Prepare data for validation
    const data = {
      carId,
      type,
      pricePerDay: Number(pricePerDay),
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

      toast.success("Mileage Plan added 🚗");
      setOpen(false);
      router.refresh();

      setPricePerDay("");
      setKmPerDay(null);
      setExtraKmPrice(null);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
 
     <Sheet open={open} onOpenChange={setOpen} >
      <SheetTrigger asChild>
        <Button type="button">Add Mileage Plan</Button>
      </SheetTrigger>
      <SheetContent>
        <ScrollArea>
        <SheetHeader>
          <SheetTitle>Add Mileage Plan</SheetTitle>
          <SheetDescription>
            Make Add your Mileage Plan. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <form className="space-y-4 p-4 mx-2 border rounded-md" onSubmit={handleSubmit}>
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
          step="0.01"
          value={pricePerDay}
          onChange={(e) => setPricePerDay(e.target.value === "" ? "" : Number(e.target.value))}
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
              step="0.01"
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
       <div className="flex gap-4 my-4 ">

      <Button className="flex-1" type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Mileage Plan"}
      </Button>
       </div>
    </form>
    
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
        </ScrollArea>
      </SheetContent>
    </Sheet>
    
  );
};
