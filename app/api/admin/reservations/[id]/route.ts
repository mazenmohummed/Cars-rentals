import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } // Type params as a Promise for Next.js 15
) {
  try {
    const { userId: clerkId } = await auth();
    const { id } = await params; // Await the id from params

    // 1. Fix: Ensure clerkId exists and is a string, not null
    if (!clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Fetch the admin user with type safety
    const admin = await prisma.user.findUnique({ 
      where: { clerkId } // Now clerkId is guaranteed to be a string
    });

    if (admin?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    const { status, paymentStatus } = body;

    // Fetch the reservation once to avoid multiple DB calls and get the totalPrice
    const existingReservation = await prisma.reservation.findUnique({
      where: { id }
    });

    if (!existingReservation) {
      return new NextResponse("Reservation not found", { status: 404 });
    }

    const updated = await prisma.reservation.update({
      where: { id },
      data: {
        status: status,
        payment: {
          upsert: {
            update: { 
              status: paymentStatus,
              paidAt: paymentStatus === "PAID" ? new Date() : undefined // Set paidAt if marking as PAID
            },
            create: {
              status: paymentStatus,
              amount: existingReservation.totalPrice,
              method: "CASH",
              paidAt: paymentStatus === "PAID" ? new Date() : undefined
            }
          }
        }
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[RESERVATION_PATCH_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}