import Action from "@/components/Main/Action";
import Cities from "@/components/Main/Cities";
import Footer from "@/components/Main/Footer";
import Img from "@/components/Main/Img";
import { Numbers } from "@/components/Main/Numbers"
import { ReservationBar } from "@/components/Main/ReservationBar";
import Reviews from "@/components/Main/Reviews";
import Vision from "@/components/Main/Vision";


export default function Home() {
  return (

    <div className="">
      <main className="">
       
       <ReservationBar/>
       <Action/>
       <Img/>
       <Numbers/>
       <Reviews/>
       <Vision/>
       <Cities/>
       
      </main>
    </div>
  );
}
