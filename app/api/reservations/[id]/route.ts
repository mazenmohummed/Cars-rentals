import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"; // ✅ Correct import

export async function DELETE(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    const { id } = await params;

    // ✅ Fix: Guard against null. If clerkId is null, stop execution.
    if (!clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Now TypeScript knows clerkId is a string, not null.
    const admin = await prisma.user.findUnique({ 
      where: { clerkId } 
    });

    if (admin?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Optional: Check if reservation exists before deleting to avoid Prisma errors
    await prisma.reservation.delete({ 
      where: { id } 
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[RESERVATION_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    const { id } = await params;

    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    // Check Admin
    const admin = await prisma.user.findUnique({ where: { clerkId } });
    if (admin?.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

    const body = await req.json();
    const { status, paymentStatus } = body;

    // 1. Fetch the current reservation to get the total price for the "create" part of upsert
    const currentReservation = await prisma.reservation.findUnique({
      where: { id },
      select: { totalPrice: true }
    });

    if (!currentReservation) return new NextResponse("Not Found", { status: 404 });

    // 2. Perform the update
    const updated = await prisma.reservation.update({
      where: { id },
      data: {
        status: status,
        payment: {
          upsert: {
            update: {
              status: paymentStatus,
              paidAt: paymentStatus === "PAID" ? new Date() : undefined,
            },
            create: {
              status: paymentStatus || "PENDING",
              amount: currentReservation.totalPrice, // Use the price from the reservation
              method: "CASH", // Default for admin manual updates
              paidAt: paymentStatus === "PAID" ? new Date() : undefined,
            },
          },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[RESERVATION_PATCH_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}