"use client"

import { useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { addDays, format } from "date-fns"
import { useRouter } from "next/navigation"
import { CalendarIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CityPicker } from "./CityPicker" // Adjust import path

// Updated Validation Schema
const FormSchema = z.object({
  pickupCityId: z.string().min(1, "Pickup city is required"),
  returnCityId: z.string().min(1, "Return city is required"),
  pickupDate: z.date({ message: "Pickup date is required." }),
  returnDate: z.date({ message: "Return date is required." }),
}).refine((data) => data.returnDate >= data.pickupDate, {
  message: "Return date cannot be before pickup date",
  path: ["returnDate"],
})

interface CarSearchFormProps {
  cities: { value: string; label: string }[];
}

export function CarSearchForm({ cities }: CarSearchFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pickupCityId: "",
      returnCityId: "",
    }
  })
  const isLoading = form.formState.isSubmitting || isPending;
  const { isSubmitting } = form.formState;

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const from = format(data.pickupDate, "yyyy-MM-dd")
    const to = format(data.returnDate, "yyyy-MM-dd")
    
    // Construct the URL with all params
    const params = new URLSearchParams({
      from,
      to,
      pickupCityId: data.pickupCityId,
      returnCityId: data.returnCityId,
    })

    startTransition(() => {
      router.push(`/cars?${params.toString()}`)
    })
  
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <Form {...form}>
  <form 
    onSubmit={form.handleSubmit(onSubmit)} 
    className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4 p-4 border rounded-lg bg-card shadow-sm w-full"
  >
    {/* MAIN CONTENT CONTAINER */}
    <div className="flex flex-col w-full gap-4">
      
      {/* CITY SELECTION GROUP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PICKUP CITY */}
        <FormField
          control={form.control}
          name="pickupCityId"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel>Pickup Location</FormLabel>
              <FormControl>
                <CityPicker 
                  title="Select pickup city" 
                  cities={cities} 
                  onChange={field.onChange} 
                  defaultValue={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* RETURN CITY */}
        <FormField
          control={form.control}
          name="returnCityId"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel>Return Location</FormLabel>
              <FormControl>
                <CityPicker 
                  title="Select return city" 
                  cities={cities} 
                  onChange={field.onChange} 
                  defaultValue={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* DATE SELECTION GROUP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PICKUP DATE */}
        <FormField 
          control={form.control}  
          name="pickupDate"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel>Pickup Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal", // Changed w-[240px] to w-full
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < today}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* RETURN DATE */}
        <FormField
          control={form.control}
          name="returnDate"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel>Return Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal", // Changed w-[240px] to w-full
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => {
                      const pickupDate = form.getValues("pickupDate");
                      if (!pickupDate) return date < today;
                      const minReturnDate = addDays(pickupDate, 3);
                      return date < minReturnDate;
                    }}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>

    {/* SUBMIT BUTTON */}
    <Button 
          type="submit" 
          disabled={isLoading} 
          className="h-10 w-full lg:w-auto mt-2 lg:mt-0 min-w-[160px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            "Search Available Cars"
          )}
        </Button>
  </form>
</Form>
  )
}