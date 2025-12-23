import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validators/review";

export async function POST(req: Request) {
  try {
    // 1. Get Clerk Identity
    const { userId: clerkId } = await auth();
    const user = await currentUser();

    if (!clerkId || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Find the corresponding User in your MongoDB
    // We need your internal Prisma ID (cuid) to satisfy the Review relation
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkId },
    });

    if (!dbUser) {
      return NextResponse.json({ message: "User not found in database" }, { status: 404 });
    }

    // 3. Validate form data
    const body = await req.json();
    const result = reviewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // 4. Create the Review
    const newReview = await prisma.review.create({
      data: {
        userId: dbUser.id, // Using the CUID from your User model
        stars: result.data.stars,
        description: result.data.description,
        // Snapshot user details from Clerk/DB
        firstName: dbUser.firstName || user.firstName,
        lastName: dbUser.lastName || user.lastName,
        avatar: user.imageUrl,
      },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error: any) {
    console.error("[REVIEWS_POST_ERROR]", error);
    return NextResponse.json(
      { message: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}