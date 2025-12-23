import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { carId: string } | Promise<{ carId: string }> }
) {
  try {
    // unwrap params if it's a promise
    const { carId } = await params;

    if (!carId) {
      return NextResponse.json({ error: "Car ID is required" }, { status: 400 });
    }

    // Delete related mileage plans first
    await prisma.mileagePlan.deleteMany({
      where: { carId },
    });

    // Delete the car
    await prisma.car.delete({
      where: { id: carId },
    });

    return NextResponse.json({ message: "Car deleted successfully" });
  } catch (err: any) {
    console.error(err);

    // Prisma record not found
    if (err.code === "P2025") {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Failed to delete car" }, { status: 500 });
  }
}





export async function PATCH(
  req: Request,
  { params }: { params: { carId: string } | Promise<{ carId: string }> }
) {
  try {
    const { carId } = await params;
    if (!carId) return NextResponse.json({ error: "Car ID is required" }, { status: 400 });

    const body = await req.json();

    // Ensure 'images' is always an array of strings for Prisma
    const imagesArray = Array.isArray(body.images) 
      ? body.images 
      : body.images ? [body.images] : [];

    const updatedCar = await prisma.car.update({
      where: { id: carId },
      data: {
        name: body.name,
        type: body.type,
        doors: body.doors,
        seats: body.seats,
        bags: body.bags,
        gearbox: body.gearbox,
        isActive: body.isActive,
        // mainImage expects a single String
        mainImage: body.mainImage || imagesArray[0] || "",
        // images expects an Array of Strings (String[])
        images: {
            set: imagesArray // Using 'set' clears the old array and adds the new one
        },
      },
    });

    return NextResponse.json(updatedCar);
  } catch (err: any) {
    console.error("PATCH ERROR:", err);
    return NextResponse.json({ error: "Failed to update database" }, { status: 500 });
  }
}