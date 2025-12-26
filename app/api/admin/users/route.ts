import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Check Authentication
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Check Authorization (Ensure requester is an ADMIN)
    const adminUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      return new NextResponse("Forbidden: Admins only", { status: 403 });
    }

    // 3. Fetch all users
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc", // Newest users first
      },
      include: {
        _count: {
          select: { reservations: true }, // Shows how many bookings they have
        },
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("[USERS_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}