interface IProps {
  Title: string;
  Text: string;
}

const NumberCard = ({ Title, Text }: IProps) => {
  return (
    <div className="
      p-4 
      mx-auto
      bg-primary
      rounded-xl 
      text-white 
      w-full 
      md:w-[300px] 
      text-center 
      md:text-left 
      transition-all 
      /* This is the key fix: */
      wrap-break-word
      overflow-wrap-anywhere
    "> 
        {/* break-words ensures long titles don't overflow */}
        <h2 className="font-bold text-2xl  md:text-3xl text-white mb-2  wrap-break-word">
          {Title}
        </h2>
        {/* whitespace-normal ensures text wraps naturally */}
        <p className="text-sm md:text-base opacity-90 leading-relaxed text-white whitespace-normal wrap-break-word">
          {Text}
        </p>
    </div>
  )
}

export default NumberCard