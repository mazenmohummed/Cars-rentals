import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const car = await prisma.car.create({
      data: {
        name: body.name,
        type: body.type,
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
