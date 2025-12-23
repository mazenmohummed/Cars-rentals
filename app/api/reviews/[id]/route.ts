import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  // 1. Define the type to match the folder name [id]
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    // 2. Unwrap the params safely
    const { id } = await params;

    // 3. Check if ID exists before deleting (Optional debugging step)
    if (!id) {
      return NextResponse.json({ error: "ID is missing" }, { status: 400 });
    }

    // 4. Delete from DB
    await prisma.review.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error: any) {
    // 5. Log the ACTUAL error to your VS Code terminal
    console.error("SERVER DELETE ERROR:", error);
    
    // Check if error is "Record not found"
    if (error.code === 'P2025') {
       return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}