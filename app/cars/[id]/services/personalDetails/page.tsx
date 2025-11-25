"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ItemTitle } from "@/components/ui/item"
import Link from "next/link"
import { useParams } from "next/navigation";

interface IProps {

}

const page = ({}: IProps) => {
       const params = useParams(); 
      const { id } = params;
  return (
    
    <main className="p-6 flex flex-wrap justify-center w-full">
        <div className="flex-wrap items-center  px-6  ">
            

            <ItemTitle className=" mx-auto my-6 text-3xl">Personal Information</ItemTitle>
        
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <Input type="text" placeholder="First Name" />
            <Input type="text" placeholder="Last Name" />
            </div>
            <Input type="email" placeholder="Email" />

            <Input type="tel" placeholder="Telephone No" className="mt-4" />

            <Input type="text" placeholder="Address" className="mt-4" />

            <Link className="flex mx-auto items-center my-6" href={`/cars/${id}/services/personalDetails/confirme`}>
          <Button className="flex mx-auto items-center w-40 my-6" children="Next "/>
          </Link>
        </div>
    </main>
  )
}

export default page