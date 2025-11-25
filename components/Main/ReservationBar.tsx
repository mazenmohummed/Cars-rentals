import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ComboboxDemo } from "@/components/HeadBar/ComboboxDemo"
import { Fragment } from "react/jsx-runtime"
import { Calendar22 } from "@/components/HeadBar/Calendar22"
import Link from "next/link";

export function ReservationBar() {
  return (
      <div className="flex w-full items-center justify-between"> 
       <div className="relative mx-auto w-full md:w-5/6 lg:w-5/6 xl:w-5/6  ">
        
    <div className="px-2">
    <Card className="w-full mx-auto mt-12 h-auto md:w-5/6 xl:w-5/6  lg:w-5/6">
          <div className="flex gap-5 h-auto flex-wrap mx-auto justify-center items-center">
          <ComboboxDemo Title="Pick Up"/>
          <ComboboxDemo Title="Return"/>
          <Calendar22 Title="From"/>
          <Calendar22 Title="To"/>
          <Link href="/cars">
          <Button children="Avilabile Cars"/>
          </Link>
          </div> 
          
    </Card>
    </div>
       </div>
       </div>
      )
}