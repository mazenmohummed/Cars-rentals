import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Get the authenticated Clerk ID from the session
    const { userId: clerkId } = await auth();

    // 2. If no session exists, return Unauthorized
    if (!clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 3. Fetch the user from your MongoDB database using clerkId
    const dbUser = await prisma.user.findUnique({
      where: { clerkId },
      select: {
        firstName: true,
        lastName: true,
        telephone: true,
        email: true,
        role: true,
        // We only select what we need to keep the payload small
      },
    });

    // 4. If the user doesn't exist in our DB yet, return 404
    if (!dbUser) {
      return new NextResponse("User not found in database", { status: 404 });
    }

    // 5. Return the user data as JSON
    return NextResponse.json(dbUser);
  } catch (error) {
    console.error("[USER_GET_ME_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}