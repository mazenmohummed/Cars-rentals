import { z } from "zod";

export const reviewSchema = z.object({
  stars: z.number().min(1, "Please select at least 1 star").max(5),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;