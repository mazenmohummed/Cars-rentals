"use client";

import { Item, ItemContent, ItemDescription, ItemTitle } from "../../ui/item";
import { Switch } from "@/components/ui/switch";

interface IProps {
  id: string;
  Name: string;
  description: string;
  Icon: React.ReactNode;
  price: number;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

const ServiceCard = ({ id, description, Name, Icon, price, isSelected, onToggle }: IProps) => {
  return (
    <div className="w-full"> 
      <Item 
  variant="outline" 
  className={`my-2 cursor-pointer shadow-sm bg-card  transition-colors ${isSelected ? "border-primary bg-primary/5" : ""}`}
  onClick={() => onToggle(id)}
>
  {/* justify-between pushes content to the far left and far right */}
  <ItemContent className="flex flex-row justify-between ">
    
    {/* LEFT SIDE: Icon, Title, and Description stacked vertically */}
    <div className="flex items-start gap-3">
      <div className="mt-1">{Icon}</div>
      <div className="flex flex-col items-start gap-1"> {/* flex-col stacks them */}
        <ItemTitle className="text-xl leading-none">{Name}</ItemTitle>
        <ItemDescription className="text-sm wrap-break-word">
          {description}
        </ItemDescription>
      </div>
    </div>

    {/* RIGHT SIDE: Price and Switch stacked vertically */}
    <div 
      className="flex items-end gap-2" 
      onClick={(e) => e.stopPropagation()}
    >
      <span className=" font-bold whitespace-nowrap ">€ {price}</span>
      <Switch 
        checked={isSelected} 
        onCheckedChange={() => onToggle(id)} 
      />
    </div>

  </ItemContent>
</Item>
    </div>
  );
};

export default ServiceCard;