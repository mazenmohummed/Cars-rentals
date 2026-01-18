// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { format } from "date-fns";
// import { CalendarIcon, Loader2 } from "lucide-react";
// import { toast } from "react-hot-toast";
// import * as React from "react";
// import { z } from "zod";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Sheet,
//   SheetClose,
//   SheetContent,
//   SheetDescription,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// // Zod Schema
// export const AddReservationSchema = z.object({
//   carId: z.string().min(1, "Car is required"),
//   startDate: z.date({
//     message: "Start date is required",
//   }),
//   endDate: z.date({
//     message: "End date is required",
//   }),
//   reason: z.string().min(1, "Reason is required"),
// }).refine((data) => data.endDate >= data.startDate, {
//   message: "End date must be after start date",
//   path: ["endDate"],
// });

// type AddReservationType = z.infer<typeof AddReservationSchema>;

// interface AddReservationProps {
//   carId: string;
// }

// export const AddReservation = ({ carId }: AddReservationProps) => {
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // 1. Initialize the form
//   const form = useForm<AddReservationType>({
//     resolver: zodResolver(AddReservationSchema),
//     defaultValues: {
//       carId: carId,
//       reason: "",
//     },
//   });

//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   // 2. Handle Submission
//   const onSubmit = async (values: AddReservationType) => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/add-reservation", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(values),
//       });

//       if (!res.ok) throw new Error("Failed to add reservation");

//       toast.success("Reservation added 🚗");
//       form.reset();
//       setOpen(false);
//     } catch (err: any) {
//       toast.error(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Sheet open={open} onOpenChange={setOpen}>
//       <SheetTrigger asChild>
//         <Button type="button">Add Reservation</Button>
//       </SheetTrigger>

//       <SheetContent className="sm:max-w-[440px]">
//         <SheetHeader>
//           <SheetTitle>Add new Reservation</SheetTitle>
//           <SheetDescription>
//             Block car availability for maintenance or external bookings.
//           </SheetDescription>
//         </SheetHeader>

//         {/* 3. Wrap in Form provider */}
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            
//             {/* START DATE */}
//             <FormField
//               control={form.control}
//               name="startDate"
//               render={({ field }) => (
//                 <FormItem className="flex flex-col">
//                   <FormLabel>Start Date</FormLabel>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <FormControl>
//                         <Button
//                           variant={"outline"}
//                           className={cn(
//                             "w-full pl-3 text-left font-normal",
//                             !field.value && "text-muted-foreground"
//                           )}
//                         >
//                           {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
//                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="single"
//                         selected={field.value}
//                         onSelect={field.onChange}
//                         disabled={(date) => date < today}
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* END DATE */}
//             <FormField
//               control={form.control}
//               name="endDate"
//               render={({ field }) => (
//                 <FormItem className="flex flex-col">
//                   <FormLabel>End Date</FormLabel>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <FormControl>
//                         <Button
//                           variant={"outline"}
//                           className={cn(
//                             "w-full pl-3 text-left font-normal",
//                             !field.value && "text-muted-foreground"
//                           )}
//                         >
//                           {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
//                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="single"
//                         selected={field.value}
//                         onSelect={field.onChange}
//                         disabled={(date) => 
//                            date < today || date < (form.getValues("startDate") || today)
//                         }
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* REASON */}
//             <FormField
//               control={form.control}
//               name="reason"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Reason</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Maintenance, Cleaning..." {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <Button type="submit" className="w-full" disabled={loading}>
//               {loading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 "Add Reservation"
//               )}
//             </Button>
//           </form>
//         </Form>

//         <SheetFooter className="mt-6">
//           <SheetClose asChild>
//             <Button variant="outline" className="w-full">Cancel</Button>
//           </SheetClose>
//         </SheetFooter>
//       </SheetContent>
//     </Sheet>
//   );
// };