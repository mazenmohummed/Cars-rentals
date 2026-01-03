import Action from "@/components/Main/Action";
import Cities from "@/components/Main/Cities";
import { Numbers } from "@/components/Main/Numbers"
import { ReservationBar } from "@/components/Main/ReservationBar";
import Vision from "@/components/Main/Vision";
import { AddReviewForm } from "@/components/ui/reviews/AddReviewForm";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ReviewsSection } from "@/components/ui/reviews/ReviewsSection";
import { EditHomepageSettings } from "@/components/Main/EditHomepageSettings";
import { prisma } from "@/lib/prisma"; // Import your prisma instance
import { requireAdmin } from "@/lib/auth"
import Image from "next/image";

interface HomeProps {
  searchParams: Promise<{ sort?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  await requireAdmin()
  const resolvedParams = await searchParams;

  // 1. Fetch the homepage data from the database
  const homepageData = await prisma.homepage.findUnique({
    where: { id: "main_config" },
  });

  return (
    <div className="">
      <main className="">
        {/* Pass initialData so the sheet inputs are pre-filled */}
        <EditHomepageSettings initialData={homepageData} />

         <div className="flex items-center justify-center gap-6 ">
             <Button className="flex my-4" children={<a href="/admin/cars">Manage Cars</a>}/>
             <Button className="flex my-4" children={<a href="/admin/users">Manage Users</a>}/>
              </div>
        <Action />

        {/* 2. Dynamic Hero Section */}
        {homepageData?.mainImg && (
          <section className="relative w-full h-[60vh] md:h-[85vh] overflow-hidden">
            {/* The Background Image */}
           
            <Image 
              src={homepageData.mainImg} 
                alt="Premium Car Rental"
                fill
                priority
                quality={85}
                className="object-cover z-0" // z-0 puts it at the bottom
                sizes="100vw"
            />
          
          </section>
        )}
        <Numbers data={homepageData} />
        
        {/* Pass data to Vision so it can show the vision text and images */}
        <Vision data={homepageData} />

         {/* cities siction */}
        <Button className="flex mx-auto my-4" children={<a href="/admin/cities">Manage Cities</a>}/>
        <Cities />

         {/* reviews siction */}
         <Button className="flex mx-auto my-4" children={<a href="/admin/reviews">Manage Reviews</a>}/>
        <SignedOut>
          <div className="p-6 border rounded-xl bg-muted text-center mx-6">
            <p className="mb-4">Please sign in to share your experience with us.</p>
            <SignInButton mode="modal">
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </div>
        </SignedOut>

        <ReviewsSection searchParams={resolvedParams} />
        
        <SignedIn>
          <AddReviewForm />
        </SignedIn>
      </main>
    </div>
  );
}