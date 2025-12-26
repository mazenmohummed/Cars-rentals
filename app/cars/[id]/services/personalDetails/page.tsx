"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ItemTitle } from "@/components/ui/item";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Phone, MapPin, Plane, AlertCircle } from "lucide-react";

// --- 1. Zod Validation Schema ---
const personalDetailsSchema = z.object({
  telephone: z.string().min(8, "Phone number must be at least 8 digits").regex(/^\+?[0-9\s\-()]+$/, "Invalid phone format"),
  street: z.string().min(3, "Street address is required"),
  status: z.string().min(2, "State/Province is required"),
  city: z.string().min(2, "City is required"),
  zip: z.string().optional(),
  flightNumber: z.string().optional(),
});

type PersonalDetailsValues = z.infer<typeof personalDetailsSchema>;

export default function PersonalDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id;

  // --- 2. React Hook Form Setup ---
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PersonalDetailsValues>({
    resolver: zodResolver(personalDetailsSchema),
    mode: "onChange", // Validates as the user types
  });

  // --- 3. Handle Form Submission ---
  const onSubmit = (data: PersonalDetailsValues) => {
    const queryParams = new URLSearchParams(searchParams.toString());
    
    // Append form data to URL
    Object.entries(data).forEach(([key, value]) => {
      if (value) queryParams.set(key, value);
    });

    router.push(`/cars/${id}/services/personalDetails/confirme?${queryParams.toString()}`);
  };

  return (
    <main className="p-6 flex flex-wrap justify-center w-full">
      <div className="flex-wrap items-center px-6 max-w-2xl w-full bg-card rounded-xl border p-8 shadow-sm">
        <ItemTitle className="mx-auto mb-8 text-3xl text-center">
          Personal Information
        </ItemTitle>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* --- Improved Telephone Input --- */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                {...register("telephone")}
                type="tel"
                placeholder="+1 234 567 890"
                className={`pl-10 ${errors.telephone ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
            </div>
            {errors.telephone && (
              <p className="text-xs font-medium text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.telephone.message}
              </p>
            )}
          </div>

          {/* --- Address Grid --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input {...register("street")} placeholder="Street" className={errors.street ? "border-destructive" : ""} />
              {errors.street && <p className="text-[10px] text-destructive">{errors.street.message}</p>}
            </div>
            <div className="space-y-2">
              <Input {...register("status")} placeholder="State/Province" className={errors.status ? "border-destructive" : ""} />
              {errors.status && <p className="text-[10px] text-destructive">{errors.status.message}</p>}
            </div>
            <div className="space-y-2">
              <Input {...register("city")} placeholder="City" className={errors.city ? "border-destructive" : ""} />
              {errors.city && <p className="text-[10px] text-destructive">{errors.city.message}</p>}
            </div>
            <div className="space-y-2">
              <Input {...register("zip")} placeholder="Zip Code (optional)" className={errors.zip ? "border-destructive" : ""} />
              {errors.zip && <p className="text-[10px] text-destructive">{errors.zip.message}</p>}
            </div>
          </div>

          {/* --- Flight Number --- */}
          <div className="space-y-2">
            <div className="relative">
              <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                {...register("flightNumber")}
                placeholder="Flight Number (Optional)"
                className="pl-10"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full md:w-40 flex mx-auto items-center mt-8 h-11"
            disabled={!isValid}
          >
            Next
          </Button>
        </form>
      </div>
    </main>
  );
}