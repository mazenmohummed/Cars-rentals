import UnavailabilityDialog from "@/components/Main/UnavailabilityDialog";
import { requireAdmin } from "@/lib/auth";

export default async function reviewsPage() {
  await requireAdmin()
  


  return (
    <main className="">
        <h1 className="flex justify-center items-center text-4xl mx-auto py-4">Manage Reviews</h1> 
    <div className="flex justify-center mt-10">
       
       <UnavailabilityDialog/>
      
    </div>
    </main>
  );
}