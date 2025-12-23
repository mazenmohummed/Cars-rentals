import AdminCars from "@/components/Main/AdminCars";
import { AddCar } from "@/components/ui/car/AddCar";
import { Button } from "@/components/ui/button";



export default function CarPage({ params }: { params: { id: string } }) {
  const carId = Number(params.id);
  


  return (
    <main className="">
        <h1 className="flex justify-center items-center text-4xl mx-auto py-4">Manage Cars</h1> 
        
        <div className="flex justify-center mx-auto my-4">

        <AddCar /> 
        </div>

    <div className="flex justify-center mt-10">
       
      < AdminCars />
    </div>
    </main>
  );
}
