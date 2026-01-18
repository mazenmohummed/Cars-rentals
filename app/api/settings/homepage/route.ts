import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// app/api/settings/homepage/route.ts
export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    
    // Destructure everything from the body
    const { 
      logo, title1, description1, title2, description2, 
      title3, description3, mainImg, visionImg, vision, visionText 
    } = body;

    const homepage = await prisma.homepage.upsert({
      where: { id: "main_config" }, 
      update: { 
        title1, description1, title2, description2, 
        title3, description3, mainImg, visionImg, vision, visionText 
      },
      create: { 
        id: "main_config",
         title1, description1, title2, description2, 
        title3, description3, mainImg, visionImg, vision, visionText 
      },
    });

    return NextResponse.json(homepage);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}


// Add this to your existing route.ts
export async function GET() {
  try {
    const homepage = await prisma.homepage.findUnique({
      where: { id: "main_config" },
    });
    
    // If nothing exists yet, return an empty object instead of crashing
    return NextResponse.json(homepage || {}); 
  } catch (error) {
    console.error("DATABASE_GET_ERROR:", error); // This shows the REAL error in your terminal
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Your existing PATCH function stays below...