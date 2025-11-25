
interface IProps {
Title:string,
Text:string,
}

const NumberCard = ({Title,Text}: IProps) => {
  return (
    <div > 
        <h2>Global reach</h2>
        <p>2,000+ SIXT stations in over 105 countries</p>
    </div>
  )
}

export default NumberCard