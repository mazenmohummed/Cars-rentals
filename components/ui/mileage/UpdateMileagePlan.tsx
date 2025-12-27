"use client";

import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { ScrollArea } from "../scroll-area";
import { useRouter } from "next/navigation";


export interface IMileagePlanData {
  type: "LIMITED" | "UNLIMITED";
  pricePerDay?: number;
  kmPerDay?: number | null;
  extraKmPrice?: number | null;
}


interface MileagePlanFormProps {
  carId: string;
  initialData?: IMileagePlanData;
  unlimitedPrice:number,
  limitedPrice:number,
}



export const updateMileagePlanSchema = z.object({
  carId: z.string(),
  type: z.enum(["LIMITED", "UNLIMITED"]),
  pricePerDay: z.number().min(1, "Price per day must be > 0"),
  kmPerDay: z.number().optional(),
  extraKmPrice: z.number().optional(),
}).superRefine((data, ctx) => {
  if (data.type === "LIMITED") {
    if (!data.kmPerDay) {
      ctx.addIssue({
        path: ["kmPerDay"],
        code: "custom",
        message: "Km per day required",
      });
    }
    if (!data.extraKmPrice) {
      ctx.addIssue({
        path: ["extraKmPrice"],
        code: "custom",
        message: "Extra Km Price required",
      });
    }
  }
});



export const UpdateMileagePlan: React.FC<MileagePlanFormProps> = ({ carId, initialData, limitedPrice, unlimitedPrice }) => {
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
   const [planType, setPlanType] = useState<"LIMITED" | "UNLIMITED">(initialData?.type || "LIMITED");
    const [prices, setPrices] = useState({
  LIMITED: initialData?.type === "LIMITED" ? limitedPrice: "",
  UNLIMITED: initialData?.type === "UNLIMITED" ? unlimitedPrice: "",
});
  const [kmPerDay, setKmPerDay] = useState<number | null>(initialData?.kmPerDay ?? null);
  const [extraKmPrice, setExtraKmPrice] = useState<number | null>(initialData?.extraKmPrice ?? null);

  const [open, setOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (initialData) {
      setPlanType(initialData.type);
      setPrices((prev) => ({
      ...prev,
      [initialData.type]: initialData.pricePerDay,
    }));
      setKmPerDay(initialData.kmPerDay ?? null);
      setExtraKmPrice(initialData.extraKmPrice ?? null);
    }
  }, [initialData]);




  const updateMileagePlan = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrors({});

  const currentPrice = prices[planType];

  const data = {
    carId,
    type: planType,
    pricePerDay: currentPrice === "" ? undefined : Number(currentPrice),
    kmPerDay: planType === "LIMITED" ? kmPerDay ?? undefined : undefined,
    extraKmPrice: planType === "LIMITED" ? extraKmPrice ?? undefined : undefined,
  };

  const result = updateMileagePlanSchema.safeParse(data);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    result.error.issues.forEach(
      (i) => (fieldErrors[i.path[0] as string] = i.message)
    );
    setErrors(fieldErrors);
    toast.error("Fix form errors");
    return;
  }

  try {
    setLoading(true);

    const res = await fetch("/api/update-mileage-plan", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
    });

    if (!res.ok) throw new Error("Failed updating mileage plan");

    toast.success("Mileage Plan Updated ✅");
    router.refresh();
    setOpen(false);
    }catch{
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};


return(
      <>
    <Sheet open={open} onOpenChange={setOpen} >
          <SheetTrigger asChild>
            <Button type="button">Update Mileage Plan</Button>
          </SheetTrigger>
          <SheetContent>
            <ScrollArea className=" ">
    <SheetHeader>
    <SheetTitle>Update Mileage Plan</SheetTitle>
    <SheetDescription>
      update your Mileage Plan. Click save when you&apos;re done.
    </SheetDescription>
  </SheetHeader>
  <form className="space-y-4 p-4 border rounded-md" onSubmit={updateMileagePlan} >
  <Select
     value={planType}
    onValueChange={(value) =>
      setPlanType(value as "LIMITED" | "UNLIMITED")    
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
        value={prices[planType]}
  onChange={(e) => {
    const val = e.target.value === "" ? "" : Number(e.target.value);
    setPrices(prev => ({ ...prev, [planType]: val }));
  }}
        className="border px-2 py-1 rounded-md w-full"
        min={0}
        required
      />
      {errors.pricePerDay && (
        <p className="text-red-500 text-sm">{errors.pricePerDay}</p>
      )}
    </div>


    {planType === "LIMITED" && (
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

    <Button className="flex-1"  type="submit" disabled={loading}>
      {loading ? "Adding..." : "update Mileage Plan"}
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
</>
);};

                      