import NumberCard from "@/components/Numbers/NumberCard"

export function Numbers (){
  return (
    <div className="flex mx-auto gap-4 justify-center w-full py-6 bg-gray-600 ">
      <div className=" flex flex-wrap px-2 gap-4 py-6">
        <NumberCard Title="Global reach" Text="2,000+ SIXT stations in over 105 countries"/> 
        <NumberCard Title="Global reach" Text="2,000+ SIXT stations in over 105 countries"/>
        <NumberCard Title="Global reach" Text="2,000+ SIXT stations in over 105 countries"/>
      </div>
    </div>
  )
}

