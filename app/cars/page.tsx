import { HeadBar } from "@/components/Main/HeadBar";
import Cars  from "@/components/Main/Cars";
import { cars } from "@/Data/cars";

export default function CarPage({ params }: { params: { id: string } }) {
  const carId = Number(params.id);
  


  return (
    <div className="flex justify-center mt-10">
      < Cars />
    </div>
  );
}

