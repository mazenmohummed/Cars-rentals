import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { carId, type, pricePerDay, kmPerDay, extraKmPrice } = body;

  if (!carId || !type || pricePerDay == null) {
    return new Response("Missing fields", { status: 400 });
  }

  try {
    const plan = await prisma.mileagePlan.create({
      data: {
        carId,
        type,
        pricePerDay,
        kmPerDay,
        extraKmPrice,
      },
    });

    return new Response(JSON.stringify(plan), { status: 201 });
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
}
