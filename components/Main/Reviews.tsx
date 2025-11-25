import {ReviewCard} from "@/components/ui/ReviewCard"

const Reviews = () => {
  return (
    <div className=" mx-auto justify-center w-full md:w-5/6 lg:w-5/6 xl:w-5/6 py-6 px-2" > 
      <h2 className="sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl" > Our reviews </h2>
      <div className="flex gap-4 justify-center py-6 flex-wrap ">
      <ReviewCard 
      Name="Basic Item" 
      Comment="A simple item with title and description." 
      ImgUrl="https://github.com/shadcn.png"/>
      <ReviewCard 
      Name="Basic Item" 
      Comment="A simple item with title and description." 
      ImgUrl="https://github.com/shadcn.png"/>
      <ReviewCard 
      Name="Basic Item" 
      Comment="A simple item with title and description." 
      ImgUrl="https://github.com/shadcn.png"/>
      </div>
    </div>
  )
}

export default Reviews