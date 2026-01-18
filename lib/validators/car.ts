// lib/validators/car.ts
import { z } from "zod";

export const carSchema = z.object({
  name: z
    .string()
    .min(2, "Car name must be at least 2 characters"),

  type: z
    .string()
    .min(1, "Car type is required"),

  comment: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .or(z.literal("")), // Allows empty strings without error
 

  doors: z
    .number()
    .int()
    .min(2, "Doors must be at least 2")
    .max(6, "Doors cannot exceed 6")
    .nullable(),

  seats: z
    .number()
    .int()
    .min(2, "Seats must be at least 2")
    .max(9, "Seats cannot exceed 9")
    .nullable(),

  bags: z
    .number()
    .int()
    .min(0, "Bags cannot be negative")
    .max(10, "Too many bags")
    .nullable(),

  gearbox: z.boolean(),

  images: z
    .array(z.string().url())
    .min(1, "At least one image is required"),

  isActive: z.boolean(),
});

export type CarInput = z.infer<typeof carSchema>;
