import Action from "@/components/Main/Action";
import Cities from "@/components/Main/Cities";
// import Img from "@/components/Main/Img"; <--- Removed this
import { Numbers } from "@/components/Main/Numbers"
import { ReservationBar } from "@/components/Main/ReservationBar";
import Vision from "@/components/Main/Vision";
import { AddReviewForm } from "@/components/Main/reviews/AddReviewForm";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ReviewsSection } from "@/components/Main/reviews/ReviewsSection";
import { EditHomepageSettings } from "@/components/Main/EditHomepageSettings";
import { prisma } from "@/lib/prisma"; // Import your prisma instance
import Image from "next/image";

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
    <div className="  ">
      <main className="">
        {/* Pass initialData so the sheet inputs are pre-filled */}
        <ReservationBar />
        <Action />

        {/* 2. Dynamic Hero Section */}
        <section className="relative w-full  h-[50vh] sm:h-[60vh] md:h-[85vh] overflow-hidden ">
          <Image 
            src={homepageData?.mainImg || "/hero-car.jpg"} 
            alt="Premium Car Rental"
            fill
            priority
            quality={90} // Slightly higher for retina mobile screens
            className="object-contain z-0" 
            sizes="100vw"
            // Using 'eager' loading implicitly via priority
          />
          
          {/* Optional: Add a mobile-only gradient overlay if you have text over the image */}
          <div className="absolute inset-0 bg-black/20 md:bg-transparent z-10" />
        </section>
        <Numbers data={homepageData} />
        
        {/* Pass data to Vision so it can show the vision text and images */}
        <Vision data={homepageData} />
        
        <Cities />

        <ReviewsSection searchParams={resolvedParams} />

        <SignedOut>
          <div className="p-6 border rounded-xl bg-background text-center mx-6">
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