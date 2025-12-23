import AdminCities from "@/components/Main/AdminCities";
import { AddCity } from "@/components/ui/city/AddCity";
import ManageReviewsPage from "@/components/ui/reviews/ManageReviewsPage";




export default async function reviewsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ from?: string; to?: string; page?: string }> 
}) {
  


  return (
    <main className="">
        <h1 className="flex justify-center items-center text-4xl mx-auto py-4">Manage Reviews</h1> 
    <div className="flex justify-center mt-10">
       
      < ManageReviewsPage searchParams={searchParams} />
    </div>
    </main>
  );
}