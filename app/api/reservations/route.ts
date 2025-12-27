import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { differenceInDays } from "date-fns";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const { 
      carId, 
      pickupCityId, 
      returnCityId, 
      mileagePlanId, 
      startDate, 
      endDate, 
      totalPrice, 
      address, 
      services, 
      flightNumber,
      telephone 
    } = body;

    // Convert string dates to Date objects for comparison
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 1. CHECK FOR UNAVAILABILITY (Maintenance/Blocks)
    const isBlocked = await prisma.carUnavailability.findFirst({
      where: {
        carId: carId, // Fixed: used 'carId' from body
        OR: [
          {
            startDate: { lte: end },
            endDate: { gte: start },
          },
        ],
      },
    });

    if (isBlocked) {
      return new NextResponse("Car is undergoing maintenance during these dates", { status: 400 });
    }

    // 2. CHECK FOR CONFLICTING RESERVATIONS (Double-booking)
    const hasConflict = await prisma.reservation.findFirst({
      where: {
        carId: carId,
        status: { notIn: ["CANCELLED"] }, // Ignore cancelled bookings
        OR: [
          {
            startDate: { lte: end },
            endDate: { gte: start },
          },
        ],
      },
    });

    if (hasConflict) {
      return new NextResponse("Car is already booked for these dates", { status: 400 });
    }

    // 3. Ensure User exists in our DB
    const dbUser = await prisma.user.upsert({
      where: { clerkId: user.id },
      update: { telephone: telephone },
      create: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        telephone: telephone,
      },
    });

    // 4. Create Reservation
    const reservation = await prisma.reservation.create({
      data: {
        userId: dbUser.id,
        carId,
        pickupCityId,
        returnCityId,
        mileagePlanId,
        startDate: start,
        endDate: end,
        rentalDays: Math.max(1, differenceInDays(end, start)),
        totalPrice,
        flightNumber: flightNumber,
        address: {
          set: address 
        },
        services: {
          create: services.map((s: any) => ({
            serviceId: s.id,
            unitPrice: s.price,
            totalPrice: s.price, 
          }))
        }
      }
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("[RESERVATION_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}