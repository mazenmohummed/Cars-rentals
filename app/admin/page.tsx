// import { requireAdmin } from "@/lib/auth"
// import Action from "@/components/Main/Action";
// import Cities from "@/components/Main/Cities";
// import Img from "@/components/Main/Img";
// import { Numbers } from "@/components/Main/Numbers"
// import { ReservationBar } from "@/components/Main/ReservationBar";

// import Vision from "@/components/Main/Vision";
// import { Button } from "@/components/ui/button";
// import { ReviewsSection } from "@/components/ui/reviews/ReviewsSection";

// interface HomeProps {
//   searchParams: Promise<{ sort?: string }>;
// }

// export default async function AdminDashboard({ searchParams }: HomeProps) {
//   await requireAdmin()
//   const resolvedParams = await searchParams;

//     return (
//     <div>
      
//       <div className="">
//             <main className="">
//                 <h1 className="flex justify-center items-center text-4xl mx-auto py-4">Admin Dashboard</h1>
                 
//              <div className="flex items-center justify-center gap-6 ">
//              <Button className="flex my-4" children={<a href="/admin/cars">Manage Cars</a>}/>
//              <Button className="flex my-4" children={<a href="/admin/users">Manage Users</a>}/>
//              </div>
//              <Action/>
//              <Img/>
//              <Numbers/>
//              <Button className="flex mx-auto my-4" children={<a href="/admin/reviews">Manage Reviews</a>}/>
//              <ReviewsSection searchParams={resolvedParams}/>
//              <Vision/>
//              <Button className="flex mx-auto my-4" children={<a href="/admin/cities">Manage Cities</a>}/>
//              <Cities/>
             
//             </main>
//           </div>
//     </div>
//   )
// }

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
        <EditHomepageSettings initialData={homepageData} />

         <div className="flex items-center justify-center gap-6 ">
             <Button className="flex my-4" children={<a href="/admin/cars">Manage Cars</a>}/>
             <Button className="flex my-4" children={<a href="/admin/users">Manage Users</a>}/>
              </div>

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