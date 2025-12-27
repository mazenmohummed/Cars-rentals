import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  // 1. Change the type to Promise
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
      const { start, end } = await req.json();
      console.log("Calc Start:", start, "End:", end);
      const traveled = end - start;
      console.log("Total Traveled:", traveled);
    
    // 2. Await the params before using them
    const { id } = await params;

    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: { mileagePlan: true },
    });

    if (!reservation) {
      return new NextResponse("Reservation not found", { status: 404 });
    }

    let extraKmUsed = 0;
    let extraKmTotal = 0;

    // Logic: If LIMITED, calculate extra fees
    if (reservation.mileagePlan.type === "LIMITED") {
      const allowedKm = (reservation.mileagePlan.kmPerDay || 0) * reservation.rentalDays;
      const traveled = end - start;
      
      if (traveled > allowedKm) {
        extraKmUsed = traveled - allowedKm;
        extraKmTotal = extraKmUsed * (reservation.mileagePlan.extraKmPrice || 0);
      }
      console.log("AllowKm:", allowedKm);
    }

    

    console.log("Final extraKmUsed to save:", extraKmUsed);

    const updated = await prisma.reservation.update({
      where: { id },
      data: {
        startOdometer: start,
        endOdometer: end,
        extraKmUsed,
        extraKmTotal,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[ODOMETER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}