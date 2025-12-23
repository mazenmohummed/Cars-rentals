import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateMileagePlanSchema = z.object({
  carId: z.string(),
  type: z.enum(["LIMITED", "UNLIMITED"]),
  pricePerDay: z.number().min(1, "Price per day must be > 0"),
  kmPerDay: z.number().optional(),
  extraKmPrice: z.number().optional(),
}).superRefine((data, ctx) => {
  if (data.type === "LIMITED") {
    if (data.kmPerDay === undefined) {
      ctx.addIssue({
        path: ["kmPerDay"],
        code: "custom",
        message: "Km per day required",
      });
    }
    if (data.extraKmPrice === undefined) {
      ctx.addIssue({
        path: ["extraKmPrice"],
        code: "custom",
        message: "Extra Km Price required",
      });
    }
  }
});

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const result = updateMileagePlanSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues.map((i) => i.message) },
        { status: 400 }
      );
    }

    const { carId, type, pricePerDay, kmPerDay, extraKmPrice } = result.data;

    const updatedPlan = await prisma.mileagePlan.upsert({
      where: {
        carId_type: { carId, type },
      },
      update: {
        pricePerDay,
        kmPerDay: type === "LIMITED" ? kmPerDay : null,
        extraKmPrice: type === "LIMITED" ? extraKmPrice : null,
      },
      create: {
        carId,
        type,
        pricePerDay,
        kmPerDay: type === "LIMITED" ? kmPerDay : null,
        extraKmPrice: type === "LIMITED" ? extraKmPrice : null,
      },
    });

    return NextResponse.json(updatedPlan);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}