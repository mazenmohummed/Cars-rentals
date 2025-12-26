"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useRouter } from "next/navigation"

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
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pickupCityId: "",
      returnCityId: "",
    }
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const from = format(data.pickupDate, "yyyy-MM-dd")
    const to = format(data.returnDate, "yyyy-MM-dd")
    
    // Construct the URL with all params
    const params = new URLSearchParams({
      from,
      to,
      pickupCityId: data.pickupCityId,
      returnCityId: data.returnCityId,
    })

    router.push(`/cars?${params.toString()}`)
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-4 p-4 border rounded-lg bg-card shadow-sm">
        <div className="flex ">
        <div className="px-6">
        <div className="flex gap-4" >
        {/* PICKUP CITY */}
        
        <FormField
          control={form.control}
          name="pickupCityId"
          render={({ field }) => (
            <FormItem className="flex flex-col w-[240px]">
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
            <FormItem className="flex flex-col w-[240px]">
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
        <div className="flex gap-4 mt-2">
        {/* PICKUP DATE */}
        <FormField 
          control={form.control}  
          name="pickupDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Pickup Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
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
            <FormItem className="flex flex-col">
              <FormLabel>Return Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
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
                    
                    // If no pickup date is selected yet, disable all past dates
                    if (!pickupDate) return date < today;

                    // Set the minimum return date to 3 days after the pickup date
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

        <Button type="submit" className="h-10 mx-6 my-auto">Search Available Cars</Button>
        </div>
      </form>
    </Form>
  )
}