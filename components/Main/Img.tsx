  import Image from "next/image";
import AhmedCars from "@/img/AhmedCars.png"


const Img = () => {
  return (
    <div className="flex w-full items-center justify-between">
       <div className="relative mx-auto w-full  h-screen">
          <img
          src="https://www.freepnglogos.com/uploads/bmw-png/black-bmw-xdrive-car-png-image-pngpix-33.png" 
          alt="Car photo"
      
          className=" object-cover"
          />
       </div>
    
     </div>
  )
}

export default Img
  
  