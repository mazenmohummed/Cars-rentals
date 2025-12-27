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

    if (!clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 1. Get the local DB User to check their role
    const dbUser = await prisma.user.findUnique({ 
      where: { clerkId } 
    });

    if (!dbUser) {
      return new NextResponse("User not found in database", { status: 404 });
    }

    // 2. Define the deletion criteria
    // If ADMIN: delete by ID only.
    // If NOT ADMIN: delete by ID AND ensure the userId matches.
    const whereClause = dbUser.role === "ADMIN" 
      ? { id } 
      : { id, userId: dbUser.id };

    // 3. Use deleteMany to avoid 404/500 errors if record doesn't exist or unauthorized
    const deletionResult = await prisma.reservation.deleteMany({ 
      where: whereClause 
    });

    // If nothing was deleted, it means either it didn't exist OR user wasn't authorized
    if (deletionResult.count === 0) {
      return new NextResponse("Forbidden or Not Found", { status: 403 });
    }

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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    const { id } = await params;

    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        car: true,
        payment: true,
        services: { include: { service: true } }
      }
    });

    if (!reservation) return new NextResponse("Reservation not found", { status: 404 });

    return NextResponse.json(reservation);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}