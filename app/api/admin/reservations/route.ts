import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Authenticate the session
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Check if the user has ADMIN privileges
    const admin = await prisma.user.findUnique({
      where: { clerkId },
      select: { role: true },
    });

    if (admin?.role !== "ADMIN") {
      return new NextResponse("Forbidden: Admins only", { status: 403 });
    }

    // 3. Fetch all reservations with relations
    const reservations = await prisma.reservation.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            telephone: true,
          },
        },
        car: {
          select: {
            name: true,
            type: true,
            mainImage: true,
          },
        },
        payment: true, // Includes payment status and amount
        pickupCity: true,
        returnCity: true,
      },
      orderBy: {
        createdAt: "desc", // Show newest bookings first
      },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error("[ADMIN_RESERVATIONS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}