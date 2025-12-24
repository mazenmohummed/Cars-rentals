"use client";

import { Item, ItemContent, ItemDescription, ItemTitle } from "../item";
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
        className={`my-2 cursor-pointer transition-colors ${isSelected ? "border-primary bg-primary/5" : ""}`}
        onClick={() => onToggle(id)}
      >
        <ItemContent className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {Icon}
              <ItemTitle className="text-xl">{Name}</ItemTitle>
            </div>
            <ItemDescription>
              {description} — <span className="font-bold text-foreground">EGP {price}</span>
            </ItemDescription>
          </div>
          {/* stopPropagation prevents double-triggering when clicking the row */}
          <div onClick={(e) => e.stopPropagation()}>
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