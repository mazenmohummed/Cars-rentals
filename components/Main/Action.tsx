import Link from "next/link";


const Action = () => {
  return (
    <div className="flex mx-auto justify-center w-full md:w-5/6 lg:w-5/6 xl:w-5/6 py-6 " >
      <div className="flex flex-col items-center gap-3">
        <h1 className=" text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl ">Start your raid now</h1>
        <Link className="flex items-center " 
           href="https://wa.me/qr/QOO46YVL7TW5G1"  
           target="_blank"
           rel="noopener noreferrer"
           >
           <h1 className=" text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl ">Contact us</h1>
           </Link>
        </div>
        
    </div>
  )
}

export default Action;