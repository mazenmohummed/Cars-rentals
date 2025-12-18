import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { carId, startDate, endDate, reason, isActive } = body;

    if (!carId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const availability = await prisma.carUnavailability.create({
      data: {
        carId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
      },
    });

    return NextResponse.json(availability);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
