"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { reviewSchema, ReviewFormValues } from "@/lib/validators/review";



export function AddReviewForm() {
  const [hoveredStars, setHoveredStars] = useState(0);
  const [loading, setLoading] = useState(false);



  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { stars: 0, description: "" },
  });

async function onSubmit(values: ReviewFormValues) {
  setLoading(true);

  try {
    // We hit the URL path, not an imported function
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    toast.success("Review submitted! ⭐");
    form.reset();
    
    // Optional: refresh the page to see the new review in the list
    window.location.reload(); 
    
  } catch (error: any) {
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
}
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4 border rounded-md bg-card">
        <FormField
          control={form.control}
          name="stars"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mx-auto">Rating</FormLabel>
              <FormControl className="mx-auto">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-8 w-8 cursor-pointer transition-colors",
                        (hoveredStars || field.value) >= star
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      )}
                      onMouseEnter={() => setHoveredStars(star)}
                      onMouseLeave={() => setHoveredStars(0)}
                      onClick={() => field.onChange(star)}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mx-auto">Your Review</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about your experience..." 
                  className="resize-none max-w-lg mx-auto"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="flex mx-auto" disabled={loading}>
          {loading ? "Submitting..." : "Post Review"}
        </Button>
      </form>
    </Form>
  );
}