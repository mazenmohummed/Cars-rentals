import { Globe, SquareUser } from "lucide-react";
import {ModeToggle} from "@/components/HeadBar/ModeToggle"
import Image from "next/image";
import AhmedCars from "@/img/AhmedCars.png"
import {ReservationBar} from "@/components/Main/ReservationBar"
import Link from "next/link";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

export function HeadBar(){
    return(
    <div >

        <nav className=" flex pt-[6] justify-center ">
            <div className="flex items-center justify-between px-6 w-full ">
             <div className="flex items-center ">
             <Link href="/">
             <h2>Cars</h2>
             </Link>

             </div>
             <div className="flex items-center gap-4">
             
                  <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <ModeToggle/>
            <Link href="/profile">
             <Globe/>
            </Link>
             </div>
           </div>
       </nav>
   
  </div>
    )
}