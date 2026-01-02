interface IProps {
  Title: string;
  Text: string;
}

const NumberCard = ({ Title, Text }: IProps) => {
  return (
    <div className="
      p-6 
      bg-white/10 
      rounded-xl 
      text-white 
      w-full 
      md:w-[300px] 
      text-center 
      md:text-left 
      transition-all 
      /* This is the key fix: */
      break-words 
      overflow-wrap-anywhere
    "> 
        {/* break-words ensures long titles don't overflow */}
        <h2 className="font-bold text-2xl md:text-3xl mb-2 text-white break-words">
          {Title}
        </h2>
        {/* whitespace-normal ensures text wraps naturally */}
        <p className="text-sm md:text-base text-gray-200 opacity-90 leading-relaxed whitespace-normal break-words">
          {Text}
        </p>
    </div>
  )
}

export default NumberCard