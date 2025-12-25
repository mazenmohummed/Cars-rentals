import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId: clerkId } = await auth();

  // 1. Narrow the type: clerkId is now string, not null
  if (!clerkId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const admin = await prisma.user.findUnique({ 
    where: { clerkId } // TypeScript is happy now
  });

  if (admin?.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const data = await prisma.carUnavailability.findMany({
    include: { car: { select: { name: true } } },
    orderBy: { startDate: "asc" }
  });
  
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    
    // 1. Narrow the type for POST as well
    if (!clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { carId, startDate, endDate, reason } = body;

    const admin = await prisma.user.findUnique({ 
      where: { clerkId } 
    });

    if (admin?.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const newBlock = await prisma.carUnavailability.create({
      data: {
        carId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
      }
    });

    return NextResponse.json(newBlock);
  } catch (error) {
    console.error("[UNAVAILABILITY_POST]", error);
    return new NextResponse("Error", { status: 500 });
  }
}