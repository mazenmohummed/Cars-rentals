import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ cityId: string }> } // Define params as a Promise
) {
  try {
    // 1. Unwrap the params
    const { cityId } = await params; 

    const body = await req.json();
    const { name, description, image } = body;

    const city = await prisma.city.update({
      where: { id: cityId }, // Use the unwrapped cityId
      data: { name, description, image },
    });

    return NextResponse.json(city);
  } catch (error: any) {
    console.error("PATCH ERROR:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ cityId: string }> } // Define params as a Promise
) {
  try {
    // 1. Unwrap the params
    const { cityId } = await params;

    await prisma.city.delete({
      where: { id: cityId },
    });
    
    return NextResponse.json({ message: "City deleted" });
  } catch (error: any) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}