import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const mileagePlanSchema = z.object({
  carId: z.string().min(1),
  type: z.enum(["LIMITED", "UNLIMITED"]),
  pricePerDay: z.number().min(0),
  kmPerDay: z.number().min(0).optional(),
  extraKmPrice: z.number().min(0).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = mileagePlanSchema.parse(body);

    // Prevent duplicate LIMITED / UNLIMITED for same car
    const existing = await prisma.mileagePlan.findFirst({
      where: {
        carId: data.carId,
        type: data.type,
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Mileage plan already exists for this car" },
        { status: 400 }
      );
    }

    const plan = await prisma.mileagePlan.create({
      data: {
        carId: data.carId,
        type: data.type,
        pricePerDay: data.pricePerDay,
        kmPerDay: data.type === "LIMITED" ? data.kmPerDay : null,
        extraKmPrice: data.type === "LIMITED" ? data.extraKmPrice : null,
      },
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 400 }
    );
  }
}