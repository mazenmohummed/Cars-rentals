import AdminCities from "@/components/Main/AdminCities";
import { AddCity } from "@/components/ui/city/AddCity";




export default function citiesPage() {
  


  return (
    <main className="">
        <h1 className="flex justify-center items-center text-4xl mx-auto py-4">Manage cities</h1> 
        
        <div className="flex justify-center mx-auto my-4">

        <AddCity/>
        </div>

    <div className="flex justify-center mt-10">
       
      < AdminCities />
    </div>
    </main>
  );
}
