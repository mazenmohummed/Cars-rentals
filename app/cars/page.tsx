import Cars from "@/components/Main/Cars";

export default async function CarPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ from?: string; to?: string }> 
}) {
  const resolvedParams = await searchParams;

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl font-bold mb-6">Available Vehicles</h1>
      <Cars searchParams={resolvedParams} />
    </div>
  );
}