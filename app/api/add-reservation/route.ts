import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AddReservationSchema } from "@/components/schemas/add-reservation";


export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = AddReservationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues },
        { status: 400 }
      );
    }

    const { carId, startDate, endDate, reason } = parsed.data;

    const reservation = await prisma.carUnavailability.create({
      data: {
        carId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
      },
    });

    return NextResponse.json(reservation, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
