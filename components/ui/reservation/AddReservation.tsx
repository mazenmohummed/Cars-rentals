"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import * as React from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Calendar22 } from "../../HeadBar/CarSearchForm";

// Zod Schema
export const AddReservationSchema = z.object({
  carId: z.string().min(1, "Car is required"),

  startDate: z.coerce.date({
    message: "Start date is required",
  }),

  endDate: z.coerce.date({
    message: "End date is required",
  }),

  reason: z.string().min(1, "Reason is required"),
})
.refine(
  (data) => data.endDate >= data.startDate,
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
);

export type AddReservationType = z.infer<typeof AddReservationSchema>;

interface AddReservationProps {
  carId: string;
}

export const AddReservation = ({ carId }: AddReservationProps) => {

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const data = { carId, startDate, endDate, reason };

    const parsed = AddReservationSchema.safeParse(data);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/add-reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) throw new Error("Failed to add reservation");

      toast.success("Reservation added 🚗");
      setOpen(false);

      setStartDate(undefined);
      setEndDate(undefined);
      setReason("");

    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button type="button">Add Reservation</Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add new Reservation</SheetTitle>
          <SheetDescription>
            Add your reservation. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-md border p-4">
          <h2 className="text-lg font-semibold">Block Car Availability</h2>

          {/* Start Date */}
          <Calendar22
            Title="Start Date"
            value={startDate}
            onChange={(date) => setStartDate(date)}
          />
          {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}

          {/* End Date */}
          <Calendar22
            Title="End Date"
            value={endDate}
            onChange={(date) => setEndDate(date)}
          />
          {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}

          {/* Reason */}
          <div className="grid gap-3">
            <Label>Reason</Label>
            <Input
              placeholder="Maintenance, booked, cleaning..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            {errors.reason && <p className="text-red-500 text-sm">{errors.reason}</p>}
          </div>

          <Button disabled={loading}>
            {loading ? "Saving..." : "Add reservation"}
          </Button>
        </form>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
