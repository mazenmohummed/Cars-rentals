import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { citySchema } from "@/lib/validators/city";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validate the incoming data against your Zod schema
    const result = citySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, image, description, transFee } = result.data;

    // 2. Check if city already exists
    const existingCity = await prisma.city.findUnique({
      where: { name },
    });

    if (existingCity) {
      return NextResponse.json(
        { message: "A city with this name already exists" },
        { status: 400 }
      );
    }

    // 3. Create the city in the database
    const newCity = await prisma.city.create({
      data: {
        name,
        image,
        description,
        transFee,
      },
    });

    return NextResponse.json(newCity, { status: 201 });
  } catch (error) {
    console.error("[CITY_POST]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cities = await prisma.city.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(cities);
  } catch (error) {
    console.error("[CITIES_GET]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}