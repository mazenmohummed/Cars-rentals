import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * UPDATE an existing unavailability block
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    const { id } = await params;

    // 1. Type Guard for Clerk ID
    if (!clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Admin Check
    const admin = await prisma.user.findUnique({ where: { clerkId } });
    if (admin?.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const { carId, startDate, endDate, reason } = body;

    // 3. Update the Record
    const updated = await prisma.carUnavailability.update({
      where: { id },
      data: {
        carId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[UNAVAILABILITY_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

/**
 * DELETE an unavailability block
 */
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

    const admin = await prisma.user.findUnique({ where: { clerkId } });
    if (admin?.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.carUnavailability.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[UNAVAILABILITY_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}