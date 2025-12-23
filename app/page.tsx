import Action from "@/components/Main/Action";
import Cities from "@/components/Main/Cities";
import Img from "@/components/Main/Img";
import { Numbers } from "@/components/Main/Numbers"
import { ReservationBar } from "@/components/Main/ReservationBar";
import Vision from "@/components/Main/Vision";
import { AddReviewForm } from "@/components/ui/reviews/AddReviewForm";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ReviewsSection } from "@/components/ui/reviews/ReviewsSection";

interface HomeProps {
  searchParams: Promise<{ sort?: string }>;
}



export default async function Home({ searchParams }: HomeProps) {
  const resolvedParams = await searchParams;
  
  return (

    <div className="">
      <main className="">
       
       <ReservationBar/>
       <Action/>
       <Img/>
       <Numbers/>
       <SignedIn>
         <AddReviewForm/>
       </SignedIn>
       <SignedOut>
        <div className="p-6 border rounded-xl bg-muted text-center">
          <p className="mb-4">Please sign in to share your experience with us.</p>
          <SignInButton mode="modal">
             <Button variant="outline">Sign In</Button>
          </SignInButton>
        </div>
      </SignedOut>
       <ReviewsSection searchParams={resolvedParams}/>
       <Vision/>
       <Cities/>
       
      </main>
    </div>
  );
}
