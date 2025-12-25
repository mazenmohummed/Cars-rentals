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