import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server"; // If using Clerk
import { NextResponse } from "next/server";
import { differenceInDays } from "date-fns";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json();
  const { carId, pickupCityId, returnCityId, mileagePlanId, startDate, endDate, totalPrice, address, services, flightNumber } = body;

  try {
    // 1. Ensure User exists in our DB
    const dbUser = await prisma.user.upsert({
      where: { clerkId: user.id },
      update: { telephone: body.telephone },
      create: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        telephone: body.telephone,
      }
    });

    // 2. Create Reservation + ReservationServices in a Transaction
    const reservation = await prisma.reservation.create({
      data: {
        userId: dbUser.id,
        carId,
        pickupCityId,
        returnCityId,
        mileagePlanId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        rentalDays: Math.max(1, differenceInDays(new Date(endDate), new Date(startDate))),
        totalPrice,
        flightNumber,
        address: {
          set: address // Use 'set' for Prisma composite types (Address)
        },
        services: {
          create: services.map((s: any) => ({
            serviceId: s.id,
            unitPrice: s.price,
            totalPrice: s.price, // Assuming quantity 1
          }))
        }
      }
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}