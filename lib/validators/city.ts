import { z } from "zod";

export const citySchema = z.object({
  name: z.string().min(2, "City name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().min(1, "Image is required"),
  transFee: z.number().min(0, "fee is required"), 
});