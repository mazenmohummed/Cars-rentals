import { Item, ItemContent, ItemDescription, ItemTitle } from "./item"
import { Switch } from "@/components/ui/switch"


interface IProps {
    Name: string,
    description: string,
    Icon: React.ReactNode; 

}

const ServiceCard = ({description,Name,Icon}: IProps) => {
  return (
    <div className="w-dvw"> 
        <Item variant="outline" className="my-2 cursor-pointer " >
            <ItemContent>
            <div className="flex gap-2" >
             {Icon}
            <ItemTitle className="text-2xl">{Name}</ItemTitle>
            </div>
            <ItemDescription>
            {description}
          </ItemDescription>
            </ItemContent>
            <Switch id="WiFi" />
          </Item>
    </div>
  )
}

export default ServiceCard