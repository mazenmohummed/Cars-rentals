
// @/components/Numbers/NumberCard.tsx
interface IProps {
  Title: string;
  Text: string;
}

const NumberCard = ({ Title, Text }: IProps) => {
  return (
    <div className="p-4 bg-white/10 rounded-lg text-white min-w-[250px]"> 
        <h2 className="font-bold text-xl mb-1">{Title}</h2>
        <p className="text-sm opacity-90">{Text}</p>
    </div>
  )
}

export default NumberCard