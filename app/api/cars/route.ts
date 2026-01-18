import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const car = await prisma.car.create({
      data: {
        name: body.name,
        type: body.type,
        comment: body.comment,
        seats: body.seats,
        bags: body.bags,
        doors: body.doors,
        gearbox: body.gearbox,
        isActive: body.isActive,
        mainImage: body.images[0] ?? "",
        images: body.images,
      },
    })

    return NextResponse.json(car)
  } catch (error) {
    console.error(error)
    return new NextResponse("Failed to create car", { status: 500 })
  }
}


export async function GET() {
  try {
    const cars = await prisma.car.findMany({
      where: {
        isActive: true, // Only fetch available cars
      },
      select: {
        id: true,
        name: true,
        // Add other fields you need for the dropdown
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(cars);
  } catch (error) {
    console.error("[CARS_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}