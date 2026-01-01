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
  // Fallback data in case the database is empty
  if (!data) return null;

  return (
    <div className="flex mx-auto gap-4 justify-center w-full py-6 bg-gray-600">
      <div className="flex flex-wrap px-2 gap-4 py-6">
        <NumberCard 
          Title={data.title1} 
          Text={data.description1 || ""} 
        /> 
        <NumberCard 
          Title={data.title2} 
          Text={data.description2 || ""} 
        />
        <NumberCard 
          Title={data.title3} 
          Text={data.description3 || ""} 
        />
      </div>
    </div>
  )
}