// @/components/Main/Numbers.tsx
import NumberCard from "@/components/Numbers/NumberCard"

interface NumbersProps {
  data: {
    title1: string;
    description1: string | null;
    title2: string;
    description2: string | null;
    title3: string;
    description3: string | null;
  } | null;
}

export function Numbers({ data }: NumbersProps) {
  if (!data) return null;

  return (
    // Changed: Added overflow-hidden to prevent side-scrolling
    // Changed: Used w-full to ensure it doesn't exceed screen width
    <div className="w-full py-10 rounded-md overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* flex-col: Stack cards on top of each other on mobile
           md:flex-row: Side-by-side on tablets and desktops
           items-center: Centers the cards when stacked
        */}
        <div className="flex flex-col lg:flex-row  rounded-md  w-full ">
          <div className="flex flex-col lg:flex-row justify-between gap-6 w-full md:gap-2 py-2">
          <NumberCard 
            Title={data.title1} 
            Text={data.description1 || ""} 
          /> 
          {/* Added a subtle divider for mobile only */}
          <div className="w-16 h-[1px] md:hidden" />
          
          <NumberCard 
            Title={data.title2} 
            Text={data.description2 || ""} 
          />
          
          <div className="w-16 h-[1px] md:hidden" />
          
          <NumberCard 
            Title={data.title3} 
            Text={data.description3 || ""} 
          />
          </div>
        </div>
      </div>
    </div>
  )
}