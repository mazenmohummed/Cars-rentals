import { Globe, SquareUser } from "lucide-react";
import {ModeToggle} from "@/components/HeadBar/ModeToggle"
import Image from "next/image";
import AhmedCars from "@/img/AhmedCars.png"
import {ReservationBar} from "@/components/Main/ReservationBar"
import Link from "next/link";

export function HeadBar(){
    return(
    <div >

        <nav className=" flex pt-[6] justify-center ">
            <div className="flex items-center justify-between px-6 w-full md:w-5/6 xl:w-5/6  lg:w-5/6 ">
             <div className="flex items-center ">
             <Link href="/">
             <h2>Cars</h2>
             </Link>

             </div>
             <div className="flex items-center gap-4">
             <Globe/>
             <SquareUser />
             <ModeToggle/>
             </div>
           </div>
       </nav>
   
  </div>
    )
}