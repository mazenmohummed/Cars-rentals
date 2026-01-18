import AdminCities from "@/components/Main/AdminCities";
import { AddCity } from "@/components/Main/city/AddCity";
import ManageReviewsPage from "@/components/Main/reviews/ManageReviewsPage";
import { requireAdmin } from "@/lib/auth"




export default async function reviewsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ from?: string; to?: string; page?: string }> 
}) {
  await requireAdmin()
  


  return (
    <main className="">
        <h1 className="flex justify-center items-center text-4xl mx-auto py-4">Manage Reviews</h1> 
    <div className="flex justify-center mt-10">
       
      < ManageReviewsPage searchParams={searchParams} />
    </div>
    </main>
  );
}