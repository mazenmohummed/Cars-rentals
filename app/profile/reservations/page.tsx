import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ProfileReservationsPage() {
  const { userId: clerkId } = await auth();

  if (!clerkId) redirect("/sign-in");

  // 1. Get the local DB user first
  const dbUser = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!dbUser) redirect("/");

  // 2. Fetch reservations with relations
  const reservations = await prisma.reservation.findMany({
    where: { userId: dbUser.id },
    include: {
      car: true,
      pickupCity: true,
      returnCity: true,
      mileagePlan: true,
      services: {
        include: { service: true }
      },
      payment: true
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Reservations</h1>
          <p className="text-muted-foreground">Manage and track your vehicle bookings.</p>
        </div>
        <Link href="/cars">
          <Button variant="default">New Booking</Button>
        </Link>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Car & ID</TableHead>
              <TableHead>Date Range</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  You haven't made any reservations yet.
                </TableCell>
              </TableRow>
            ) : (
              reservations.map((res) => (
                <TableRow key={res.id}>
                    
                  <TableCell>
                    <Link href={`/profile/reservations/${res.id}`}>
                    <div className="font-semibold">{res.car.name}</div>
                    <div className="text-xs text-muted-foreground uppercase">{res.id.slice(-8)}</div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/profile/reservations/${res.id}`}>
                    <div className="text-sm">
                      {format(new Date(res.startDate), "dd MMM yyyy")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      to {format(new Date(res.endDate), "dd MMM yyyy")}
                    </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/profile/reservations/${res.id}`}>
                    <div className="text-sm flex flex-col">
                      <span>From: {res.pickupCity.name}</span>
                      <span>To: {res.returnCity.name}</span>
                    </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/profile/reservations/${res.id}`}>
                    <Badge variant={getStatusVariant(res.status)}>
                      {res.status.replace("_", " ")}
                    </Badge>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    <Link href={`/profile/reservations/${res.id}`}>
                    EGP {res.totalPrice.toLocaleString()}
                    </Link>
                  </TableCell>
                  
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// Helper to color-code status badges
function getStatusVariant(status: string) {
  switch (status) {
    case "CONFIRMED": return "default";
    case "PICKED_UP": return "secondary";
    case "RETURNED": return "outline";
    case "CANCELLED": return "destructive";
    default: return "secondary";
  }
}