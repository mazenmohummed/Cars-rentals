"use client";

import { useTransition } from "react"; // 1. Import useTransition
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ItemTitle } from "@/components/ui/item";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Phone, Plane, AlertCircle, Loader2 } from "lucide-react"; // 2. Import Loader2

// ... Schema and Types stay the same ...
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

  // 3. Initialize the transition hook
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting }, // 4. Add isSubmitting for extra safety
  } = useForm<PersonalDetailsValues>({
    resolver: zodResolver(personalDetailsSchema),
    mode: "onChange",
  });

  const onSubmit = (data: PersonalDetailsValues) => {
    // 5. Wrap the navigation in startTransition
    startTransition(() => {
      const queryParams = new URLSearchParams(searchParams.toString());
      
      Object.entries(data).forEach(([key, value]) => {
        if (value) queryParams.set(key, value);
      });

      router.push(`/cars/${id}/services/personalDetails/confirme?${queryParams.toString()}`);
    });
  };

  // Combine both loading states
  const isLoading = isPending || isSubmitting;

  return (
    <main className="p-6 flex flex-wrap justify-center w-full">
      <div className={`flex-wrap items-center px-6 max-w-2xl w-full bg-card rounded-xl border p-8 shadow-sm transition-opacity ${isLoading ? "opacity-60 pointer-events-none" : ""}`}>
        <ItemTitle className="mx-auto mb-8 text-3xl text-center">
          Personal Information
        </ItemTitle>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* ... Inputs stay exactly the same ... */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                {...register("telephone")}
                type="tel"
                placeholder="+1 234 567 890"
                className={`pl-10 ${errors.telephone ? "border-destructive" : ""}`}
              />
            </div>
            {errors.telephone && <p className="text-xs text-destructive flex gap-1"><AlertCircle className="h-3 w-3" /> {errors.telephone.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input {...register("street")} placeholder="Street" />
            <Input {...register("status")} placeholder="State/Province" />
            <Input {...register("city")} placeholder="City" />
            <Input {...register("zip")} placeholder="Zip Code (optional)" />
          </div>

          <div className="relative">
            <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input {...register("flightNumber")} placeholder="Flight Number (Optional)" className="pl-10" />
          </div>

          {/* --- UPDATED BUTTON --- */}
          <Button
            type="submit"
            className="w-full md:w-40 flex mx-auto items-center mt-8 h-11 shadow-md"
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Next"
            )}
          </Button>
        </form>
      </div>
    </main>
  );
}