import { z } from "zod";

export const AddReservationSchema = z.object({
  carId: z.string().min(1, "Car is required"),
  startDate: z.coerce.date({ message: "Start date is required" }),
  endDate: z.coerce.date({ message: "End date is required" }),
  reason: z.string().optional(),
});

export type AddReservationType = z.infer<typeof AddReservationSchema>;
