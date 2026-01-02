import Action from "@/components/Main/Action";
import Cities from "@/components/Main/Cities";
// import Img from "@/components/Main/Img"; <--- Removed this
import { Numbers } from "@/components/Main/Numbers"
import { ReservationBar } from "@/components/Main/ReservationBar";
import Vision from "@/components/Main/Vision";
import { AddReviewForm } from "@/components/ui/reviews/AddReviewForm";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ReviewsSection } from "@/components/ui/reviews/ReviewsSection";
import { EditHomepageSettings } from "@/components/Main/EditHomepageSettings";
import { prisma } from "@/lib/prisma"; // Import your prisma instance

interface HomeProps {
  searchParams: Promise<{ sort?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedParams = await searchParams;

  // 1. Fetch the homepage data from the database
  const homepageData = await prisma.homepage.findUnique({
    where: { id: "main_config" },
  });

  return (
    <div className="">
      <main className="">
        {/* Pass initialData so the sheet inputs are pre-filled */}
        <ReservationBar />
        <Action />

        {/* 2. Dynamic Hero Section */}
        {homepageData?.mainImg && (
          <section className="flex w-full items-center justify-between">
            {/* The Background Image */}
           <div className="relative mx-auto w-full ">
            <img
              src={homepageData.mainImg}
              alt="Hero Background"
              className="object-cover" 
              // object-cover ensures the image isn't stretched/blurry
            />
           </div>
          </section>
        )}
        <Numbers data={homepageData} />
        
        {/* Pass data to Vision so it can show the vision text and images */}
        <Vision data={homepageData} />
        
        <Cities />

        <ReviewsSection searchParams={resolvedParams} />

        <SignedOut>
          <div className="p-6 border rounded-xl bg-muted text-center mx-6">
            <p className="mb-4">Please sign in to share your experience with us.</p>
            <SignInButton mode="modal">
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <AddReviewForm />
        </SignedIn>
      </main>
    </div>
  );
}