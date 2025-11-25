import { CityCard } from "../ui/CityCard"


const Cities = () => {
  return (
        <div className=" mx-auto justify-center w-full md:w-5/6 lg:w-5/6 xl:w-5/6 py-6 px-2" >
            <div className="flex justify-center mx-auto"> 
                <h2 className=" text-2xl md:text-3xl lg:text-4xl xl:text-4xl " > Our Cities </h2>
            </div> 
          <div className="flex gap-4 justify-center py-6 flex-wrap ">
               <CityCard 
               Name="Hurghada" 
               Comment="A simple item with title and description."
               ImgUrl="https://tse4.mm.bing.net/th/id/OIP.lEjlzmcZgp-AkQHYtQcAcgHaEK?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3" 
                />
                <CityCard 
               Name="Hurghada" 
               Comment="A simple item with title and description."
               ImgUrl="https://tse4.mm.bing.net/th/id/OIP.lEjlzmcZgp-AkQHYtQcAcgHaEK?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3" 
                />
                <CityCard 
               Name="Hurghada" 
               Comment="A simple item with title and description."
               ImgUrl="https://tse4.mm.bing.net/th/id/OIP.lEjlzmcZgp-AkQHYtQcAcgHaEK?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3" 
                />
                <CityCard 
               Name="Hurghada" 
               Comment="A simple item with title and description."
               ImgUrl="https://tse4.mm.bing.net/th/id/OIP.lEjlzmcZgp-AkQHYtQcAcgHaEK?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3" 
                />
          </div>
        </div>

  )
}

export default Cities