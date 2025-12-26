import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Authentication Check
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Authorization Check (Only Admins can change roles)
    const currentUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!currentUser || currentUser.role !== "ADMIN") {
      return new NextResponse("Forbidden: Admin access required", { status: 403 });
    }

    // 3. Parse Request Body and Params
    const { id } = await params; // Await params for Next.js 15
    const { role } = await req.json();

    // 4. Validate Role (Optional but recommended)
    const validRoles = ["CUSTOMER", "ADMIN", "STAFF"];
    if (!validRoles.includes(role)) {
      return new NextResponse("Invalid role provided", { status: 400 });
    }

    // 5. Update User Role
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[USER_ROLE_PATCH_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    const { id } = await params;

    // Branch 1: No auth
    if (!clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Branch 2: Verify Admin status
    const admin = await prisma.user.findUnique({ where: { clerkId } });
    if (!admin || admin.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Branch 3: Get the target user to check if they exist and check clerkId
    const targetUser = await prisma.user.findUnique({ where: { id } });
    
    if (!targetUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Branch 4: Prevent self-deletion
    if (targetUser.clerkId === clerkId) {
      return new NextResponse("Self-deletion is not allowed", { status: 400 });
    }

    // Branch 5: Success deletion
    await prisma.user.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });

  } catch (error: any) {
    console.error("[USER_DELETE_ERROR]", error);

    // Branch 6: Database constraint error (User has reservations)
    if (error.code === 'P2003' || error.message?.includes('Foreign key constraint')) {
      return new NextResponse(
        "Cannot delete user with active reservations. Delete their history first.", 
        { status: 400 }
      );
    }

    // Branch 7: Generic catch-all error
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}