import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { format, differenceInDays } from "date-fns";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Plane, CreditCard, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OdometerForm } from "@/components/Form/OdometerForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReservationDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const { userId: clerkId } = await auth();

  if (!clerkId) redirect("/sign-in");

  // 1. Get the local DB User
  const dbUser = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!dbUser) redirect("/");

  // 2. Fetch Reservation with ALL nested relations
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: {
      car: true,
      pickupCity: true,
      returnCity: true,
      mileagePlan: true,
      services: {
        include: { service: true } // Nested include to get Service Name & Price
      },
      payment: true
    }
  });

// 3. Updated Security Check
if (!reservation) {
  return notFound();
}

// Allow access if the user IS the owner OR the user IS an ADMIN
const isOwner = reservation.userId === dbUser.id;
const isAdmin = dbUser.role === "ADMIN" || dbUser.role === "STAFF";

if (!isOwner && !isAdmin) {
  return notFound(); // Regular users still get 404 for other people's bookings
}

  // 4. Calculations for the UI
  const days = reservation.rentalDays;
  const rentalTotal = reservation.mileagePlan.pricePerDay * days;
  const servicesTotal = reservation.services.reduce((acc, s) => acc + s.totalPrice, 0);
  const cityFees = reservation.pickupCity.transFee + reservation.returnCity.transFee;

  console.log(reservation.extraKmUsed);

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 max-w-5xl">
      {/* Header Navigation */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/profile/reservations">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Booking #{reservation.id.slice(-8).toUpperCase()}</h1>
          <p className="text-muted-foreground text-sm">
            Created on {format(reservation.createdAt, "MMMM dd, yyyy")}
          </p>
        </div>
        <div className="ml-auto">
           <Badge className="text-base px-4 py-1" variant={getStatusVariant(reservation.status)}>
              {reservation.status.replace("_", " ")}
           </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Car & Dates Card */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle & Itinerary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 aspect-video bg-muted rounded-lg overflow-hidden relative">
                   <img 
                      src={reservation.car.mainImage} 
                      alt={reservation.car.name} 
                      className="object-cover w-full h-full"
                   />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{reservation.car.name}</h3>
                  <p className="text-muted-foreground">{reservation.car.type}</p>
                  <div className="flex gap-2 flex-wrap mt-2">
                    <Badge variant="secondary">{reservation.car.gearbox ? "Automatic" : "Manual"}</Badge>
                    <Badge variant="secondary">{reservation.car.seats} Seats</Badge>
                    <Badge variant="secondary">{reservation.car.bags} Bags</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" /> <span className="text-sm">Pick-up</span>
                  </div>
                  <p className="font-semibold">{format(reservation.startDate, "EEE, MMM dd, yyyy")}</p>
                  <div className="flex items-center gap-1 text-sm mt-1">
                    <MapPin className="h-3 w-3 text-primary" /> {reservation.pickupCity.name}
                  </div>
                </div>

                <div className="space-y-1">
                   <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" /> <span className="text-sm">Return</span>
                  </div>
                  <p className="font-semibold">{format(reservation.endDate, "EEE, MMM dd, yyyy")}</p>
                  <div className="flex items-center gap-1 text-sm mt-1">
                    <MapPin className="h-3 w-3 text-primary" /> {reservation.returnCity.name}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info Card */}
          <Card>
            <CardHeader>
               <CardTitle className="text-lg">Customer Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between gap-4 text-sm">
                <div>
                <div>
                  <p className="text-muted-foreground mb-1">Contact Info</p>
                  <div className="flex items-center gap-2">
                     <User className="h-4 w-4" />
                     <span>{dbUser.firstName} {dbUser.lastName}</span>
                  </div>
                  <p className="ml-6">{dbUser.email}</p>
                  <p className="ml-6">
                    <span className="font-semibold text-foreground"></span> {dbUser.telephone || "No phone provided"}
                  </p>
                  <p className="ml-6">{reservation.address.street}, {reservation.address.city}</p>
                  <p className="ml-6">{reservation.address.zip}</p>
                </div>
                
                {reservation.flightNumber && (
                  <div className="my-4">
                    <p className="text-muted-foreground mb-1">Arrival Info</p>
                    <div className="flex items-center gap-2">
                       <Plane className="h-4 w-4" />
                       <span>Flight: {reservation.flightNumber}</span>
                    </div>
                  </div>
                )}
                </div>
                {/* Admin Only Section */}
                {dbUser.role === "ADMIN" && (
                  <div className="pt-4 border-t">
                    <p className="text-xs font-bold text-primary uppercase mb-2">Staff Only: Mileage Tracking</p>
                    <OdometerForm 
                      initialEnd={reservation.endOdometer ?? 0} 
                      initialStart={reservation.startOdometer ?? 0} 
                      reservationId={reservation.id}
                    />
                  </div>
                )}
                <div className="mt-2 p-2 bg-muted rounded text-xs">
                  <div className="flex justify-between">
                    <span>Distance Traveled:</span>
                    <span className="font-bold">
                      {reservation.endOdometer && reservation.startOdometer 
                        ? (reservation.endOdometer - reservation.startOdometer).toLocaleString() 
                        : 0} km
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN - Payment Breakdown */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="">
              <CardTitle>Payment Summary</CardTitle>
              <CardDescription>Breakdown of charges</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
               <Table>
                 <TableBody>
                   {/* Base Rental */}
                   <TableRow>
                     <TableCell>
                        <span className="font-medium">Car Rental</span>
                        <div className="text-xs text-muted-foreground">
                          {days} days x EGP {reservation.mileagePlan.pricePerDay}
                        </div>
                     </TableCell>
                     <TableCell className="text-right">
                        {rentalTotal.toLocaleString()}
                     </TableCell>
                   </TableRow>

                   {/* Services Loop */}
                   {reservation.services.map((rs) => (
                     <TableRow key={rs.id}>
                       <TableCell>
                         <span className="font-medium">{rs.service.name}</span>
                       </TableCell>
                       <TableCell className="text-right">
                         {rs.totalPrice.toLocaleString()}
                       </TableCell>
                     </TableRow>
                   ))}

                   {/* Fees */}
                   {cityFees > 0 && (
                     <TableRow>
                       <TableCell>Transport Fees</TableCell>
                       <TableCell className="text-right">{cityFees.toLocaleString()}</TableCell>
                     </TableRow>
                   )}
                   
                   {/* Extra Mileage Fee */}
                   {reservation.extraKmTotal !== null && reservation.extraKmTotal > 0 && (
                    <TableRow className="">
                      <TableCell>
                        <span className="font-bold">Extra Mileage Fee</span>
                        <div className="text-[10px] text-muted-foreground">
                          {reservation.extraKmUsed} km over limit x {reservation.mileagePlan.extraKmPrice?.toFixed(2)} /km
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        + EGP {reservation.extraKmTotal.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  )}

                   {/* Total */}
                   <TableRow className=" font-bold">
                    <TableCell className="text-lg">GRAND TOTAL</TableCell>
                    <TableCell className="text-right text-lg">
                      EGP {(reservation.totalPrice + (reservation.extraKmTotal || 0)).toLocaleString()}
                    </TableCell>
                  </TableRow>
                 </TableBody>
               </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Payment Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reservation.payment ? (
                 <div className="space-y-2">
                   <div className="flex justify-between">
                     <span>Status:</span>
                     <Badge variant="outline">{reservation.payment.status}</Badge>
                   </div>
                   {/* <div className="flex justify-between">
                     <span>Method:</span>
                     <span>{reservation.payment.method}</span>
                   </div> */}
                 </div>
              ) : (
                <div className="text-center space-y-3">
                   <p className="text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 p-2 rounded text-sm">
                     Payment is pending upon pickup.
                   </p>
                   {/* You can add a Pay Now button here later */}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper for status colors
function getStatusVariant(status: string) {
  switch (status) {
    case "CONFIRMED": return "default"; // Black/White
    case "PENDING": return "secondary"; // Grey
    case "CANCELLED": return "destructive"; // Red
    case "RETURNED": return "outline";
    default: return "secondary";
  }
}