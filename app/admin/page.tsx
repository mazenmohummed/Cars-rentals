import { requireAdmin } from "@/lib/auth"
import Action from "@/components/Main/Action";
import Cities from "@/components/Main/Cities";
import Img from "@/components/Main/Img";
import { Numbers } from "@/components/Main/Numbers"
import { ReservationBar } from "@/components/Main/ReservationBar";
import Reviews from "@/components/Main/Reviews";
import Vision from "@/components/Main/Vision";
import { Button } from "@/components/ui/button";

export default async function AdminDashboard() {
  await requireAdmin()

    return (
    <div>
      
      <div className="">
            <main className="">
                <h1 className="flex justify-center items-center text-4xl mx-auto py-4">Admin Dashboard</h1>
                 
             
             <Button className="flex mx-auto my-4" children={<a href="/admin/cars">Manage Cars</a>}/>
             <Action/>
             <Img/>
             <Numbers/>
             <Button className="flex mx-auto my-4" children={<a href="/admin/reviews">Manage Reviews</a>}/>
             <Reviews/>
             <Vision/>
             <Button className="flex mx-auto my-4" children={<a href="/admin/cities">Manage Cities</a>}/>
             <Cities/>
             
            </main>
          </div>
    </div>
  )
}